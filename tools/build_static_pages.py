#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Doranchae (구 Hangeul Quest) — 정적 학습 페이지 생성기
=====================================
data/nhs/L*/ep*.json 에 이미 들어 있는 내용으로 **검색엔진이 읽을 수 있는**
정적 HTML 페이지를 만든다. 새 콘텐츠를 쓰는 게 아니라 "주소를 붙이는" 작업.

왜 필요한가
-----------
nhs.html 은 72편 전체가 URL 한 개 안에 있고, 본문은 JS가 나중에 fetch 한다.
→ 검색 결과에 걸릴 '페이지'가 존재하지 않는다.
이 스크립트는 문법 카드마다 / 에피소드마다 **글자가 처음부터 들어 있는**
HTML을 만들어 준다. 각 페이지는 앱(nhs.html)으로 보내는 미끼 역할.

레벨별 공개/잠금 (2026-08-27~)
-----------------------------
매 실행마다 ALL_LEVELS(L1~L6) 전부를 대상으로 학습 로드맵 허브(learn/index.html)를
레벨 탭 구조로 만든다. 그중 --levels(또는 --all)로 넘긴 레벨만 "공개(open)" 상태로
실제 문법/이야기 내용이 담긴 페이지 + 정상 링크 + sitemap.xml 등록까지 된다.
넘기지 않은 레벨은 자동으로 "잠금(locked)" 상태로 처리된다:
  * 개별 페이지는 제목·태그만 있고 본문은 "🔒 아직 공개되지 않았어요" 플레이스홀더
  * 허브·에피소드 안의 카드는 <a href>가 아니라 클릭 자체가 안 되는 <div>
  * <meta name="robots" content="noindex,follow"> 로 검색 노출 차단
  * sitemap.xml에서 제외

즉 "레벨 3을 나중에 공개하자"는 다음에 이 스크립트를 --levels에 L3까지 포함해서
한 번 더 돌리기만 하면 된다 — 콘텐츠는 data/nhs/L3/*.json에 이미 있으므로 새로
쓸 게 없고, 링크 활성화·잠금 태그 제거·sitemap 등록이 전부 자동으로 처리된다.

쓰는 법
-------
    python3 tools/build_static_pages.py                  # 기본: L1, L2 공개 (나머지는 잠금)
    python3 tools/build_static_pages.py --levels L1 L2 L3 # L3까지 공개
    python3 tools/build_static_pages.py --all             # 전 레벨 공개 (검증 후에만!)

출력
----
    learn/index.html                 허브 (레벨 탭)
    learn/grammar/<slug>.html        문법 항목별
    learn/episode/<lv>-<ep>.html     에피소드별
    sitemap.xml                      (저장소 루트, 공개 레벨 URL만)
    robots.txt                       (저장소 루트)

주의
----
* 기존 파일은 건드리지 않는다. nhs.html 무편집.
* 다시 돌리면 learn/ 아래를 통째로 새로 만든다 (손으로 고치지 말 것).
* 새 편을 추가한 뒤 다시 돌리면 페이지가 자동으로 따라온다.
* 슬러그(파일명)는 ALL_LEVELS를 항상 L1→L6 고정 순서로 처리해서 만들기 때문에,
  어떤 레벨을 공개/잠금으로 넘기든 같은 레벨의 파일명은 항상 동일하게 유지된다
  (나중에 공개해도 주소가 안 바뀜).
"""

import argparse
import html
import json
import re
import shutil
from datetime import date
from pathlib import Path

# ─────────────────────────────────────────────────────────────
# 설정
# ─────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "nhs"
OUT = ROOT / "learn"
SITE = "https://doranchae.com"

DEFAULT_LEVELS = ["L1", "L2"]          # 검증된 범위만 먼저 연다 (= 공개 레벨)
ALL_LEVELS = ["L1", "L2", "L3", "L4", "L5", "L6"]

# 🔴 저작권 표기는 이제 core/site-info.js가 단일 소스 (2026-08-14).
# 이 스크립트는 <span data-cr-*> 자리표시자만 심고, 실제 이름/연도/문구는 JS가 채운다 —
# index/nhs/Kids/Privacy/FAQ/Terms와 동일한 소스를 씀. 이름이 바뀌면 core/site-info.js만 고치면 됨.

# 📊 방문 통계 (Cloudflare Web Analytics — 무료·쿠키 없음·동의 배너 불필요)
#    Cloudflare 대시보드 › Web Analytics 에서 사이트를 추가하면 토큰을 줍니다.
#    그 토큰을 아래 따옴표 안에 붙여 넣고 다시 돌리면 전 페이지에 들어갑니다.
#    비워 두면 아무 스크립트도 나가지 않습니다 (지금 상태).
CF_ANALYTICS_TOKEN = "ab5c8a27012d4f40b323317238dbeb2b"

LEVEL_LABEL = {
    "L1": ("Level 1", "입문 · Beginner"),
    "L2": ("Level 2", "초급 · Elementary"),
    "L3": ("Level 3", "초중급 · Upper Elementary"),
    "L4": ("Level 4", "중급 · Intermediate"),
    "L5": ("Level 5", "중상급 · Upper-Intermediate"),
    "L6": ("Level 6", "고급 · Advanced"),
}

TIER_LABEL = {
    "core": "핵심 문법",
    "preview": "미리보기",
    "foundation": "개념 기초",
}

LOCK_TAG = "<span class='tag'>🔒 준비 중 · Coming Soon</span>"

# 옛 주소 → 새 주소 리다이렉트 (2026-08-27~)
# ---------------------------------------------------------------
# learn/ 을 zip으로 옮기다가, 예전(유실된) 생성기 버전이 만들어둔 파일 114개가
# 기기에 고아로 남아있는 걸 발견해 정리했다. 그중 8개는 L1·L2 문법 페이지였는데,
# 그사이 data/nhs/*.json 의 grammar 배열 내용이 바뀌면서 slug가 달라진 것들이었다
# (이 스크립트 재작성과는 무관 — 예전부터 있던 콘텐츠 drift). git 히스토리에서
# 옛 페이지의 실제 제목을 확인해 새 페이지와 대조한 결과:
#   - 5개는 같은 문법 항목이 새 slug로 그대로 살아있음 → 그 페이지로 리다이렉트.
#   - 3개는 그 문법 항목 자체가 해당 편의 grammar 배열에서 빠짐(다른 항목으로 교체됨)
#     → 정확히 대응하는 새 페이지가 없으므로, 해당 에피소드 페이지로 리다이렉트.
# 사이트가 순수 정적이라 서버 차원의 301은 불가능 — hq-mobile.html과 동일하게
# <meta refresh>+JS location.replace 스텁으로 처리(검색엔진엔 canonical로 알려줌).
# build()가 매 실행마다 learn/ 을 통째로 새로 만들기 때문에, 리다이렉트도 반드시
# 여기 REDIRECTS에 등록해야 재실행 후에도 사라지지 않는다 — 수작업으로 옆에 파일만
# 만들어두면 다음 실행에서 함께 삭제된다.
REDIRECTS = {
    # old (learn/ 기준 상대경로) → new (사이트 루트 기준 절대경로)
    "grammar/l1-ep05-connecting-two-actions-order.html": "/learn/episode/l1-ep05.html",
    "grammar/l1-ep07-inability-more-ep08.html": "/learn/grammar/l1-ep07-inability-more-l2.html",
    "grammar/l1-ep09-counter-words-which-one-for-what.html": "/learn/grammar/l1-ep09-counter-words-which.html",
    "grammar/l1-ep12-coming-level-2-verb-modifiers.html": "/learn/grammar/l1-ep12-coming-l2-ep01-verb-modifiers.html",
    "grammar/l2-ep03-because-reason.html": "/learn/grammar/l2-ep03-because-reason-then-sequence.html",
    "grammar/l2-ep07-doing-something-someone-respectful.html": "/learn/grammar/l2-ep07-doing-something-someone-plain-respectful.html",
    "grammar/l2-ep07-person.html": "/learn/episode/l2-ep07.html",
    "grammar/l2-ep11-realization-from-what-you-were-told-oh-i.html": "/learn/episode/l2-ep11.html",
}

# ─────────────────────────────────────────────────────────────
# 유틸
# ─────────────────────────────────────────────────────────────

def esc(s):
    return html.escape(str(s if s is not None else ""), quote=True)


def rich(s):
    """**굵게** 와 줄바꿈만 처리한 안전한 HTML."""
    out = esc(s)
    out = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", out)
    return out.replace("\n", "<br>")


STOPWORDS = {
    "a", "an", "the", "to", "of", "in", "on", "for", "and", "or", "but", "is",
    "are", "be", "we", "you", "it", "its", "this", "that", "with", "as", "at",
    "by", "from", "s", "t", "do", "does", "let", "lets", "before", "after",
    "when", "how", "what", "so", "not", "your", "my", "one",
}


def slugify(text, fallback, max_words=5):
    """title_en 이 문장형인 경우가 많아 의미어 몇 개만 골라 짧게 만든다."""
    s = (text or "").lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    words = [w for w in s.split() if w and w not in STOPWORDS]
    if not words:                      # 전부 불용어였다면 원문 그대로 시도
        words = [w for w in s.split() if w]
    slug = "-".join(words[:max_words])
    return slug[:50].strip("-") or fallback


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", s or "")


def meta_desc(*parts, limit=155):
    text = " ".join(strip_tags(p) for p in parts if p)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > limit:
        text = text[: limit - 1].rsplit(" ", 1)[0] + "…"
    return text


# ─────────────────────────────────────────────────────────────
# 공통 레이아웃
# ─────────────────────────────────────────────────────────────
CSS = """
:root{--teal:#4ECDC4;--navy:#0a2540;--ink:#1f2937;--mute:#6b7280;--line:#e5e7eb;--bg:#fbfaf8;--amber:#F59E0B}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
 font-family:'Noto Sans KR',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
 line-height:1.75;font-size:17px}
a{color:#0f766e}
header.site{background:var(--navy);padding:14px 20px}
header.site a.dc-mark{display:inline-flex;align-items:center;gap:8px;color:#fff;text-decoration:none;
 font-family:'Gaegu',cursive;font-weight:700;font-size:22px;letter-spacing:.01em}
header.site a.dc-mark svg{flex-shrink:0}
header.site .dc-desc{font-family:'Noto Sans KR',sans-serif;font-weight:400;font-size:14px;color:var(--teal);letter-spacing:0}
main{max-width:780px;margin:0 auto;padding:28px 20px 64px}
nav.crumb{font-size:14px;color:var(--mute);margin-bottom:18px}
nav.crumb a{color:var(--mute)}
h1{font-size:30px;line-height:1.35;margin:.2em 0 .1em}
h1 .en{display:block;font-size:17px;font-weight:400;color:var(--mute);margin-top:6px}
h2{font-size:21px;margin:2em 0 .6em;padding-bottom:6px;border-bottom:2px solid var(--line)}
h3{font-size:17px;margin:1.4em 0 .4em}
.tagrow{margin:10px 0 22px}
.tag{display:inline-block;background:#fff;border:1px solid var(--line);border-radius:999px;
 padding:3px 12px;font-size:13px;color:var(--mute);margin:0 6px 6px 0}
.pattern{background:var(--navy);color:#fff;border-radius:10px;padding:14px 18px;
 font-size:17px;margin:18px 0}
.lead{font-size:17px;color:#374151}
.box{border-radius:10px;padding:13px 16px;margin:12px 0;border-left:5px solid var(--line);background:#fff}
.box b{display:block;margin-bottom:4px}
.box.blue{border-color:#3b82f6;background:#eff6ff}
.box.green{border-color:#10b981;background:#ecfdf5}
.box.amber{border-color:var(--amber);background:#fffbeb}
.box.red{border-color:#ef4444;background:#fef2f2}
.box.tip{border-color:var(--teal);background:#f0fdfa}
table{border-collapse:collapse;width:100%;margin:14px 0;background:#fff;font-size:15px}
th,td{border:1px solid var(--line);padding:8px 10px;text-align:left;vertical-align:top}
th{background:#f3f4f6;font-weight:700}
ul.ex{list-style:none;padding:0;margin:10px 0}
ul.ex li{background:#fff;border:1px solid var(--line);border-radius:8px;padding:10px 14px;margin:8px 0}
ul.ex .ko{font-weight:600}
ul.ex .spk{color:var(--teal);font-weight:700}
ul.ex .spk::after{content:':';color:var(--mute);font-weight:400;margin:0 6px 0 1px}
ul.ex .en{display:block;color:var(--mute);font-size:15px}
.scene{background:#fff;border:2px dashed var(--teal);border-radius:10px;padding:14px 18px;margin:16px 0}
.cta{display:block;background:var(--teal);color:#06302c!important;text-decoration:none;font-weight:700;
 text-align:center;border-radius:10px;padding:15px;margin:30px 0 10px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;margin:14px 0}
.card{display:block;background:#fff;border:1px solid var(--line);border-radius:10px;padding:13px 15px;
 text-decoration:none;color:inherit}
.card:hover{border-color:var(--teal)}
.card b{display:block;font-size:16px}
.card span{display:block;color:var(--mute);font-size:14px;margin-top:3px}
.lockcard{opacity:.55;cursor:default;pointer-events:none}
.lockcard:hover{border-color:var(--line)}
.lockcard b::before{content:'🔒 '}
footer{border-top:1px solid var(--line);margin-top:44px;padding-top:18px;color:var(--mute);font-size:14px}
@media(max-width:600px){body{font-size:16px}h1{font-size:25px}main{padding:20px 16px 50px}}
"""

HUB_CSS = """
.lvl-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:22px 0 18px;position:sticky;top:0;background:var(--bg);
 padding:10px 0;z-index:5;border-bottom:1px solid var(--line)}
.lvl-tab{font-family:'Noto Sans KR',sans-serif;font-size:14px;font-weight:700;color:var(--mute);
 background:#fff;border:1.5px solid var(--line);border-radius:999px;padding:7px 16px;cursor:pointer;
 transition:all .15s ease}
.lvl-tab:hover{border-color:var(--teal);color:var(--ink)}
.lvl-tab.active{background:var(--navy);border-color:var(--navy);color:#fff}
.lvl-panel h2{margin-top:6px}
@media(max-width:600px){.lvl-tabs{top:0;gap:5px}.lvl-tab{font-size:13px;padding:6px 12px}}
"""

HUB_JS = """
<script>
function showLvl(n){
  document.querySelectorAll('.lvl-panel').forEach(function(p){p.style.display = (p.dataset.lvl===String(n))?'block':'none';});
  document.querySelectorAll('.lvl-tab').forEach(function(t){t.classList.remove('active');});
  var tab=document.getElementById('lvl-tab-'+n); if(tab) tab.classList.add('active');
  var bar=document.querySelector('.lvl-tabs'); if(bar) bar.scrollIntoView({block:'start',behavior:'smooth'});
}
</script>
"""


def page(title, desc, body, canonical, jsonld=None, locked=False, extra_head="", extra_body_end=""):
    ld = ""
    if jsonld:
        ld = ('\n<script type="application/ld+json">'
              + json.dumps(jsonld, ensure_ascii=False) + "</script>")
    robots = "\n<meta name='robots' content='noindex,follow'>" if locked else ""
    note = "<br><span data-cr-note></span>"
    beacon = ""
    if CF_ANALYTICS_TOKEN.strip():
        tok = json.dumps({"token": CF_ANALYTICS_TOKEN.strip()}, ensure_ascii=False)
        beacon = ("\n<!-- Cloudflare Web Analytics -->"
                  "<script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' "
                  f"data-cf-beacon='{tok}'></script>"
                  "<!-- End Cloudflare Web Analytics -->")
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{esc(canonical)}">
<meta property="og:type" content="article">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{esc(canonical)}">
<meta property="og:site_name" content="Doranchae">
<link rel="icon" type="image/png" sizes="464x464" href="/logo_hq.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700&family=Gaegu:wght@700&display=swap" rel="stylesheet">
<style>{CSS}{extra_head}</style>{ld}{robots}
</head>
<body>
<header class="site"><a href="/learn/" class="dc-mark">
  <svg width="24" height="19" viewBox="147 46 146 118" xmlns="http://www.w3.org/2000/svg">
    <path d="M153 98 Q158 93 166 97 L220 52 L274 97 Q281 93 287 98" fill="none" stroke="#4ECDC4" stroke-width="2"/>
    <path d="M153 98 L220 52 L287 98" fill="#4ECDC4" opacity="0.1"/>
    <rect x="181" y="117" width="26" height="2.8" rx="1.4" fill="#4ECDC4"/>
    <rect x="181" y="117" width="2.8" height="36" rx="1.4" fill="#4ECDC4"/>
    <rect x="181" y="150.2" width="26" height="2.8" rx="1.4" fill="#4ECDC4"/>
    <circle cx="243" cy="119" r="3.6" fill="#FF6B6B"/>
    <rect x="228" y="128" width="30" height="2.8" rx="1.4" fill="#FF6B6B"/>
    <line x1="243" y1="132" x2="232" y2="152" stroke="#FF6B6B" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="243" y1="132" x2="254" y2="152" stroke="#FF6B6B" stroke-width="2.8" stroke-linecap="round"/>
  </svg>
  Doranchae<span class="dc-desc"> · 한국어 학습 자료</span>
</a></header>
<main>
{body}
<footer>
© <span data-cr-year></span> <span data-cr-name></span>{note}<br>
<a href="/">Doranchae 홈</a> · <a href="/learn/">학습 자료 전체</a> · <a href="/license.html">이용 조건</a>
</footer>
</main>{beacon}
<script src="/core/site-info.js"></script>{extra_body_end}
</body>
</html>
"""


# ─────────────────────────────────────────────────────────────
# 문법 카드 렌더링 (공개)
# ─────────────────────────────────────────────────────────────

def render_table(t):
    cols = t.get("columns") or t.get("headers") or []
    rows = t.get("rows") or []
    if not rows:
        return ""
    head = "".join(f"<th>{rich(c)}</th>" for c in cols)
    body = ""
    for r in rows:
        body += "<tr>" + "".join(f"<td>{rich(c)}</td>" for c in r) + "</tr>"
    head = f"<thead><tr>{head}</tr></thead>" if head else ""
    return f"<table>{head}<tbody>{body}</tbody></table>"


def render_examples(items):
    if not items:
        return ""
    out = "<ul class='ex'>"
    for e in items:
        if isinstance(e, str):
            out += f"<li><span class='ko'>{rich(e)}</span></li>"
            continue
        ko = e.get("ko") or e.get("korean") or ""
        en = e.get("en") or e.get("english") or ""
        out += f"<li><span class='ko'>{rich(ko)}</span>"
        if en:
            out += f"<span class='en'>{rich(en)}</span>"
        out += "</li>"
    return out + "</ul>"


def grammar_body(g, ep, lv, ep_slug):
    lvl_name = LEVEL_LABEL.get(lv, (lv, ""))[0]
    tier = TIER_LABEL.get(g.get("tier"), "")
    parts = []

    parts.append("<nav class='crumb'><a href='/learn/'>학습 자료</a> › "
                 f"{esc(lvl_name)} › "
                 f"<a href='/learn/episode/{ep_slug}.html'>{esc(ep['title'])}</a> › 문법</nav>")
    parts.append(f"<h1>{esc(g['title'])}<span class='en'>{esc(g.get('title_en',''))}</span></h1>")

    tags = [f"<span class='tag'>{esc(lvl_name)}</span>"]
    if tier:
        tags.append(f"<span class='tag'>{esc(tier)}</span>")
    if ep.get("scene"):
        tags.append(f"<span class='tag'>{esc(ep['scene'])}</span>")
    parts.append("<div class='tagrow'>" + "".join(tags) + "</div>")

    if g.get("pattern"):
        parts.append(f"<div class='pattern'>{rich(g['pattern'])}</div>")
    if g.get("rule"):
        parts.append(f"<p class='lead'>{rich(g['rule'])}</p>")
    if g.get("explanation_en"):
        parts.append(f"<p class='lead'>{rich(g['explanation_en'])}</p>")
    if g.get("explanation"):
        parts.append(f"<p class='lead'>{rich(g['explanation'])}</p>")

    sc = g.get("scene_example")
    if isinstance(sc, dict) and (sc.get("korean") or sc.get("ko")):
        ko = sc.get("korean") or sc.get("ko")
        en = sc.get("english") or sc.get("en") or ""
        parts.append("<h2>이야기 속에서는 이렇게 쓰입니다</h2>"
                     f"<div class='scene'><b>{rich(ko)}</b><br>{rich(en)}</div>")

    boxes = g.get("rule_boxes") or ([g["rule_box"]] if g.get("rule_box") else [])
    if boxes:
        parts.append("<h2>규칙</h2>")
        for b in boxes:
            if isinstance(b, str):
                parts.append(f"<div class='box tip'>{rich(b)}</div>")
            else:
                kind = b.get("type", "")
                kind = kind if kind in ("blue", "green", "amber", "red") else "tip"
                t = f"<b>{rich(b.get('title',''))}</b>" if b.get("title") else ""
                parts.append(f"<div class='box {kind}'>{t}{rich(b.get('content',''))}</div>")

    if g.get("rules"):
        rows = []
        for r in g["rules"]:
            rows.append([r.get("form", ""), r.get("condition", ""), r.get("example", "")])
        parts.append("<h2>형태별 정리</h2>"
                     + render_table({"headers": ["형태", "쓰임", "예"], "rows": rows}))

    if g.get("table"):
        parts.append(render_table(g["table"]))

    if g.get("example_groups"):
        parts.append("<h2>예문</h2>")
        for grp in g["example_groups"]:
            parts.append(f"<h3>{rich(grp.get('label',''))}</h3>"
                         + render_examples(grp.get("items") or []))
        if g.get("examples"):
            parts.append(render_examples(g["examples"]))
    elif g.get("examples"):
        parts.append("<h2>예문</h2>" + render_examples(g["examples"]))

    if g.get("tip"):
        parts.append(f"<div class='box amber'><b>💡 팁</b>{rich(g['tip'])}</div>")
    if g.get("note"):
        parts.append(f"<div class='box amber'>{rich(g['note'])}</div>")

    parts.append("<h2>어디에 나오나요</h2>"
                 f"<p>이 문법은 <a href='/learn/episode/{ep_slug}.html'>"
                 f"{esc(lvl_name)} {esc(ep['id'])} 「{esc(ep['title'])}」</a> 에 나옵니다. "
                 "이야기를 보고 듣고 연습하려면 아래에서 이어서 학습하세요.</p>")
    parts.append("<a class='cta' href='/nhs.html'>▶ 앱에서 이 편 학습하기 — 무료</a>")
    return "\n".join(parts)


def episode_body(ep, lv, gram_links):
    lvl_name, lvl_desc = LEVEL_LABEL.get(lv, (lv, ""))
    parts = []
    parts.append("<nav class='crumb'><a href='/learn/'>학습 자료</a> › "
                 f"{esc(lvl_name)}</nav>")
    parts.append(f"<h1>{esc(ep['title'])}<span class='en'>{esc(ep.get('title_en',''))}</span></h1>")

    tags = [f"<span class='tag'>{esc(lvl_name)}</span>",
            f"<span class='tag'>{esc(lvl_desc)}</span>"]
    if ep.get("scene"):
        tags.append(f"<span class='tag'>{esc(ep['scene'])}</span>")
    parts.append("<div class='tagrow'>" + "".join(tags) + "</div>")

    goal = ep.get("goal") or {}
    if goal.get("ko"):
        parts.append(f"<div class='box tip'><b>학습 목표</b>{rich(goal['ko'])}"
                     + (f"<br>{rich(goal.get('en',''))}" if goal.get("en") else "") + "</div>")

    chars = ep.get("characters") or []
    if chars:
        names = " · ".join(esc(c.get("name", "")) for c in chars if c.get("name"))
        if names.strip(" ·"):
            parts.append(f"<p><b>등장인물</b> — {names}</p>")

    script = ep.get("script") or []
    if script:
        parts.append("<h2>이야기 맛보기</h2>")
        out = "<ul class='ex'>"
        for line in script[:5]:
            spk = ""
            for c in chars:
                if c.get("id") == line.get("speaker"):
                    spk = c.get("name", "")
            pre = f"<b class='spk'>{esc(spk)}</b>" if spk else ""
            out += (f"<li>{pre}<span class='ko'>{rich(line.get('text',''))}</span>"
                    f"<span class='en'>{rich(line.get('en',''))}</span></li>")
        parts.append(out + "</ul>")
        if len(script) > 5:
            parts.append(f"<p style='color:#6b7280'>전체 {len(script)}줄과 음성·슬라이드는 앱에서 볼 수 있습니다.</p>")

    if gram_links:
        parts.append("<h2>이 편에서 배우는 문법</h2><div class='cards'>")
        for slug, t, te in gram_links:
            parts.append(f"<a class='card' href='/learn/grammar/{slug}.html'>"
                         f"<b>{esc(t)}</b><span>{esc(te)}</span></a>")
        parts.append("</div>")

    vocab = ep.get("vocab") or []
    if vocab:
        parts.append("<h2>새 어휘</h2>")
        for grp in vocab:
            if not isinstance(grp, dict):
                continue
            items = grp.get("items")
            if not items:
                continue
            if grp.get("category"):
                parts.append(f"<h3>{esc(grp['category'])}</h3>")
            rows = [[i.get("korean", ""), i.get("romanization", ""), i.get("english", "")]
                    for i in items if isinstance(i, dict)]
            parts.append(render_table({"headers": ["한국어", "로마자", "English"], "rows": rows}))

    parts.append("<a class='cta' href='/nhs.html'>▶ 앱에서 이 편 학습하기 — 무료</a>")
    return "\n".join(parts)


# ─────────────────────────────────────────────────────────────
# 잠긴(미공개) 레벨 — 플레이스홀더 렌더링
# ─────────────────────────────────────────────────────────────

def locked_grammar_body(g, ep, lv, ep_slug):
    lvl_name = LEVEL_LABEL.get(lv, (lv, ""))[0]
    parts = []
    parts.append("<nav class='crumb'><a href='/learn/'>학습 자료</a> › "
                 f"{esc(lvl_name)} › {esc(ep['title'])} › 문법</nav>")
    parts.append(f"<h1>{esc(g['title'])}<span class='en'>{esc(g.get('title_en',''))}</span></h1>")
    parts.append(f"<div class='tagrow'><span class='tag'>{esc(lvl_name)}</span>{LOCK_TAG}</div>")
    parts.append(
        "<div class='box tip'><b>🔒 아직 공개되지 않았어요</b>"
        f"이 문법 설명 페이지는 {esc(lvl_name)} 공개와 함께 열려요."
        "<br><span style='color:var(--mute);font-size:14px'>"
        f"This grammar page unlocks when {esc(lvl_name)} goes public.</span></div>"
    )
    parts.append("<h2>어디에 나오나요</h2>"
                 f"<p>이 문법은 {esc(lvl_name)} 「{esc(ep['title'])}」 에 나올 예정이에요. "
                 "지금은 Level 1&ndash;2 자료를 먼저 만나보세요.</p>")
    parts.append("<a class='cta' href='/learn/'>← 지금 볼 수 있는 학습 자료 (Level 1&ndash;2)</a>")
    return "\n".join(parts)


def locked_episode_body(ep, lv, gram_links):
    lvl_name = LEVEL_LABEL.get(lv, (lv, ""))[0]
    parts = []
    parts.append(f"<nav class='crumb'><a href='/learn/'>학습 자료</a> › {esc(lvl_name)}</nav>")
    parts.append(f"<h1>{esc(ep['title'])}<span class='en'>{esc(ep.get('title_en',''))}</span></h1>")
    parts.append(f"<div class='tagrow'><span class='tag'>{esc(lvl_name)}</span>{LOCK_TAG}</div>")
    parts.append(
        "<div class='box tip'><b>🔒 아직 공개되지 않았어요</b>"
        "이 레벨의 학습 자료는 준비 중이에요. Level 1&ndash;2 자료를 먼저 만나보세요."
        "<br><span style='color:var(--mute);font-size:14px'>"
        "This level's free pages aren't published yet — check out Level 1&ndash;2 in the meantime.</span></div>"
    )
    if gram_links:
        parts.append("<h2>이 편에서 배우는 문법</h2><div class='cards'>")
        for slug, t, te in gram_links:
            # 잠긴 레벨끼리도 서로 클릭으로 이어지지 않도록 <a>가 아니라 <div>로 렌더링.
            parts.append(f"<div class='card lockcard'><b>{esc(t)}</b><span>{esc(te)}</span></div>")
        parts.append("</div>")
    parts.append("<a class='cta' href='/learn/'>← 지금 볼 수 있는 학습 자료 (Level 1&ndash;2)</a>")
    return "\n".join(parts)


def redirect_page(target):
    """옛 주소용 리다이렉트 스텁. hq-mobile.html과 동일 패턴(meta refresh + JS)."""
    full = f"{SITE}{target}"
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>이동 중… · Doranchae</title>
<link rel="canonical" href="{esc(full)}">
<meta http-equiv="refresh" content="0; url={esc(target)}">
<meta name="robots" content="noindex,follow">
<link rel="icon" type="image/png" sizes="464x464" href="/logo_hq.png">
<style>
html,body{{height:100%;margin:0;background:#0a2540;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif;}}
.wrap{{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;box-sizing:border-box;}}
.wrap a{{color:#7fd9c8;font-weight:700;}}
</style>
<script>location.replace('{target}' + location.hash);</script>
</head>
<body>
<div class="wrap">
  <p>이동 중이에요… Redirecting…</p>
  <p>자동으로 이동하지 않으면 여기를 눌러주세요:<br>
  <a href="{esc(target)}">doranchae.com{esc(target)}</a></p>
</div>
</body>
</html>
"""


# ─────────────────────────────────────────────────────────────
# 빌드
# ─────────────────────────────────────────────────────────────

def build(open_levels):
    open_set = set(open_levels)
    before = set()
    if OUT.exists():
        before = {p for p in OUT.rglob("*.html")}
        try:
            shutil.rmtree(OUT)
            before = set()
        except (PermissionError, OSError):
            # 일부 환경(샌드박스·읽기전용 마운트)에서는 삭제가 막힌다.
            # 그럴 땐 덮어쓰고, 남은 옛 파일을 마지막에 알려 준다.
            pass
    (OUT / "grammar").mkdir(parents=True, exist_ok=True)
    (OUT / "episode").mkdir(parents=True, exist_ok=True)
    written = set()

    urls = []          # sitemap에 들어갈 URL (공개 레벨만)
    hub = {}            # lv -> [(ep_slug, title, title_en, gram_links, is_open), ...]
    used_slugs = set()
    n_gram_open = 0
    n_gram_locked = 0

    # 항상 ALL_LEVELS를 고정 순서(L1→L6)로 처리 — 슬러그가 실행마다 안정적으로 유지됨.
    for lv in ALL_LEVELS:
        lvl_dir = DATA / lv
        if not lvl_dir.exists():
            continue
        is_open = lv in open_set
        files = sorted(lvl_dir.glob("ep*.json"))
        hub[lv] = []
        for f in files:
            ep = json.loads(f.read_text(encoding="utf-8"))
            ep_slug = f"{lv.lower()}-{ep['id']}"
            lvl_name = LEVEL_LABEL.get(lv, (lv, ""))[0]

            gram_links = []
            for g in (ep.get("grammar") or []):
                base = f"{lv.lower()}-{ep['id']}-" + slugify(
                    g.get("title_en") or g.get("title"), g.get("id", "g"))
                slug = base
                i = 2
                while slug in used_slugs:
                    slug = f"{base}-{i}"
                    i += 1
                used_slugs.add(slug)

                title = f"{g['title']} — 한국어 문법 | Doranchae"
                canon = f"{SITE}/learn/grammar/{slug}.html"
                gp = OUT / "grammar" / f"{slug}.html"

                if is_open:
                    desc = meta_desc(g.get("explanation_en") or g.get("rule") or g.get("title_en"))
                    ld = {
                        "@context": "https://schema.org",
                        "@type": "LearningResource",
                        "name": g["title"],
                        "alternateName": g.get("title_en", ""),
                        "inLanguage": "ko",
                        "learningResourceType": "grammar explanation",
                        "educationalLevel": lvl_name,
                        "isAccessibleForFree": True,
                        "url": canon,
                    }
                    gp.write_text(page(title, desc, grammar_body(g, ep, lv, ep_slug), canon, ld),
                                  encoding="utf-8")
                    urls.append(f"/learn/grammar/{slug}.html")
                    n_gram_open += 1
                else:
                    desc = meta_desc(f"{g.get('title_en','')} — {lvl_name} 문법. 공개 예정이에요.")
                    ld = {
                        "@context": "https://schema.org",
                        "@type": "LearningResource",
                        "name": g["title"],
                        "alternateName": g.get("title_en", ""),
                        "inLanguage": "ko",
                        "learningResourceType": "grammar explanation",
                        "educationalLevel": lvl_name,
                        "isAccessibleForFree": False,
                        "url": canon,
                    }
                    gp.write_text(page(title, desc, locked_grammar_body(g, ep, lv, ep_slug), canon,
                                        ld, locked=True),
                                  encoding="utf-8")
                    n_gram_locked += 1

                written.add(gp)
                gram_links.append((slug, g["title"], g.get("title_en", "")))

            canon = f"{SITE}/learn/episode/{ep_slug}.html"
            epp = OUT / "episode" / f"{ep_slug}.html"

            if is_open:
                title = f"{ep['title']} — {lvl_name} 한국어 에피소드 | Doranchae"
                desc = meta_desc((ep.get("goal") or {}).get("ko"), ep.get("title_en"))
                ld = {
                    "@context": "https://schema.org",
                    "@type": "LearningResource",
                    "name": ep["title"],
                    "alternateName": ep.get("title_en", ""),
                    "inLanguage": "ko",
                    "learningResourceType": "lesson",
                    "educationalLevel": lvl_name,
                    "isAccessibleForFree": True,
                    "url": canon,
                }
                epp.write_text(page(title, desc, episode_body(ep, lv, gram_links), canon, ld),
                               encoding="utf-8")
                urls.append(f"/learn/episode/{ep_slug}.html")
            else:
                title = f"{ep['title']} — {lvl_name} 한국어 에피소드 | Doranchae"
                desc = meta_desc(f"{ep.get('title_en','')} — {lvl_name} 이야기. 공개 예정이에요.")
                ld = {
                    "@context": "https://schema.org",
                    "@type": "LearningResource",
                    "name": ep["title"],
                    "alternateName": ep.get("title_en", ""),
                    "inLanguage": "ko",
                    "learningResourceType": "lesson",
                    "educationalLevel": lvl_name,
                    "isAccessibleForFree": False,
                    "url": canon,
                }
                epp.write_text(page(title, desc, locked_episode_body(ep, lv, gram_links), canon,
                                     ld, locked=True),
                               encoding="utf-8")

            written.add(epp)
            hub[lv].append((ep_slug, ep["title"], ep.get("title_en", ""), gram_links, is_open))

    # ── 허브 (레벨 탭) ──
    b = ["<h1>한국어 학습 자료<span class='en'>Free Korean lessons — grammar, vocabulary, stories</span></h1>",
         "<p class='lead'>이야기로 시작해서 문법으로 이어집니다. 여기 있는 설명은 미리 보기이고, "
         "이야기·음성·연습 문제는 앱에서 이어집니다.</p>",
         "<a class='cta' href='/nhs.html'>▶ 앱에서 학습 시작하기 — 무료</a>"]

    levels_present = [lv for lv in ALL_LEVELS if lv in hub]
    tabs = []
    for i, lv in enumerate(levels_present):
        is_open = lv in open_set
        tabs.append(
            f"<button class=\"lvl-tab{' active' if i == 0 else ''}\" id=\"lvl-tab-{i+1}\" "
            f"onclick=\"showLvl({i+1})\">{esc(LEVEL_LABEL.get(lv, (lv,''))[0])}"
            f"{' 🔒' if not is_open else ''}</button>"
        )
    b.append('<div class="lvl-tabs" role="tablist" aria-label="레벨 선택">' + "".join(tabs) + "</div>")

    for i, lv in enumerate(levels_present):
        is_open = lv in open_set
        lvl_name, lvl_desc = LEVEL_LABEL.get(lv, (lv, ""))
        display = "block" if i == 0 else "none"
        panel = [f'<section class="lvl-panel" id="lvl-panel-{i+1}" data-lvl="{i+1}" style="display:{display}">']
        header = f"<h2>{esc(lvl_name)} · {esc(lvl_desc)}{(' ' + LOCK_TAG) if not is_open else ''}</h2>"
        panel.append(header)
        if not is_open:
            panel.append(
                f"<p class='lead' style='font-size:15px;color:var(--mute)'>이 레벨은 아직 공개 전이에요. "
                "공개되면 이 페이지에서 바로 볼 수 있어요. Level 1&ndash;2를 먼저 만나보세요.</p>"
            )
        panel.append("<div class='cards'>")
        for slug, t, te, _, _ in hub[lv]:
            if is_open:
                panel.append(f"<a class='card' href='/learn/episode/{slug}.html'>"
                             f"<b>{esc(t)}</b><span>{esc(te)}</span></a>")
            else:
                panel.append(f"<div class='card lockcard'><b>{esc(t)}</b><span>{esc(te)}</span></div>")
        panel.append("</div>")
        panel.append("<h3>문법 항목</h3><div class='cards'>")
        for _, _, _, gl, _ in hub[lv]:
            for slug, t, te in gl:
                if is_open:
                    panel.append(f"<a class='card' href='/learn/grammar/{slug}.html'>"
                                 f"<b>{esc(t)}</b><span>{esc(te)}</span></a>")
                else:
                    panel.append(f"<div class='card lockcard'><b>{esc(t)}</b><span>{esc(te)}</span></div>")
        panel.append("</div>")
        panel.append("</section>")
        b.append("\n".join(panel))

    written.add(OUT / "index.html")
    (OUT / "index.html").write_text(
        page("한국어 학습 자료 — 문법·어휘·이야기 | Doranchae",
             "한국어 문법 설명과 어휘, 이야기 기반 에피소드. 한국어 선생님이 직접 만든 학습 자료입니다.",
             "\n".join(b), f"{SITE}/learn/",
             extra_head=HUB_CSS, extra_body_end=HUB_JS),
        encoding="utf-8")
    urls.insert(0, "/learn/")

    # ── 옛 주소 리다이렉트 (REDIRECTS 참고) ── sitemap에는 넣지 않음(진짜 페이지가 아니므로).
    for old_rel, target in REDIRECTS.items():
        rp = OUT / old_rel
        rp.parent.mkdir(parents=True, exist_ok=True)
        rp.write_text(redirect_page(target), encoding="utf-8")
        written.add(rp)

    # ── sitemap · robots ── (sitemap은 공개 레벨 URL만 — urls 리스트가 이미 그렇게 쌓였음)
    today = date.today().isoformat()
    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in ["/", "/nhs.html", "/faq.html", "/license.html"] + urls:
        sm.append(f"  <url><loc>{SITE}{u}</loc><lastmod>{today}</lastmod></url>")
    sm.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(sm) + "\n", encoding="utf-8")

    # 🔒 슬라이드·음성·영상은 검색·AI 크롤러가 긁어가지 않도록 차단합니다.
    #    Kids 슬라이드는 실사에서 파생된 캐릭터라 아이들 초상과 이어집니다.
    #    JSON 은 막지 않습니다(앱이 읽어야 하고, 글자는 정적 페이지로 이미 공개).
    (ROOT / "robots.txt").write_text(
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /admin.html\n"
        "Disallow: /dashboard.html\n"
        "\n# 이미지·음성·영상 — 크롤링 금지\n"
        "Disallow: /data/elem/\n"
        "Disallow: /data/*/slides/\n"
        "Disallow: /data/*/TTS/\n"
        "Disallow: /data/*/videos/\n"
        "\n# 이미지 검색에도 넣지 않음\n"
        "User-agent: Googlebot-Image\n"
        "Disallow: /data/\n"
        f"\nSitemap: {SITE}/sitemap.xml\n",
        encoding="utf-8")

    print(f"✅ 공개 레벨: {', '.join(open_levels) if open_levels else '(없음)'}")
    print(f"   문법 페이지   공개 {n_gram_open}개 · 잠금 {n_gram_locked}개")
    print(f"   에피소드 페이지 {sum(len(v) for v in hub.values())}개 (그중 공개 "
          f"{sum(1 for v in hub.values() for e in v if e[4])}개)")
    print(f"   sitemap URL   {len(urls) + 4}개 (공개 레벨만)")
    print(f"   옛 주소 리다이렉트 {len(REDIRECTS)}개")
    print(f"   → {OUT}")
    stale = sorted(before - written)
    if stale:
        print(f"\n⚠️  이전 빌드의 옆 파일 {len(stale)}개가 남았습니다 (이 환경은 삭제 권한이 없음).")
        print("   내 컴퓨터에서 이 스크립트를 한 번 다시 돌리면 자동으로 정리됩니다.")
        for q in stale[:5]:
            print(f"   · {q.relative_to(ROOT).as_posix()}")
        if len(stale) > 5:
            print(f"   · … 외 {len(stale)-5}개")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--levels", nargs="+", default=None,
                     help="공개(open) 상태로 만들 레벨들. 나머지 레벨은 자동으로 잠금 처리됨.")
    ap.add_argument("--all", action="store_true", help="전 레벨을 공개 상태로 (검증 후에만!)")
    a = ap.parse_args()
    build(ALL_LEVELS if a.all else (a.levels or DEFAULT_LEVELS))
