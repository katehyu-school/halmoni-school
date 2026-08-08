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

쓰는 법
-------
    python3 tools/build_static_pages.py            # 기본: L1, L2
    python3 tools/build_static_pages.py --levels L1 L2 L3
    python3 tools/build_static_pages.py --all      # 전 레벨 (검증 후에만!)

출력
----
    learn/index.html                 허브
    learn/grammar/<slug>.html        문법 항목별
    learn/episode/<lv>-<ep>.html     에피소드별
    sitemap.xml                      (저장소 루트)
    robots.txt                       (저장소 루트)

주의
----
* 기존 파일은 건드리지 않는다. nhs.html 무편집.
* 다시 돌리면 learn/ 아래를 통째로 새로 만든다 (손으로 고치지 말 것).
* 새 편을 추가한 뒤 다시 돌리면 페이지가 자동으로 따라온다.
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
SITE = "https://hangeulquest.com"

DEFAULT_LEVELS = ["L1", "L2"]          # 검증된 범위만 먼저 연다
ALL_LEVELS = ["L1", "L2", "L3", "L4", "L5", "L6"]

# 🔴 라이선스 표기 — 이 두 줄만 고치면 전 페이지에 반영된다. (2026-08-06 확정)
LICENSE_LINE = "© 2026 Kate HaeOk Shin Yu"
LICENSE_NOTE = ("글·코드 <a href='/license.html'>CC BY-NC-SA 4.0</a>"
                " · 음성·이미지는 사이트 내 재생 전용")

# 📊 방문 통계 (Cloudflare Web Analytics — 무료·쿠키 없음·동의 배너 불필요)
#    Cloudflare 대시보드 › Web Analytics 에서 사이트를 추가하면 토큰을 줍니다.
#    그 토큰을 아래 따옴표 안에 붙여 넣고 다시 돌리면 전 페이지에 들어갑니다.
#    비워 두면 아무 스크립트도 나가지 않습니다 (지금 상태).
CF_ANALYTICS_TOKEN = ""

LEVEL_LABEL = {
    "L1": ("Level 1", "입문 · Beginner"),
    "L2": ("Level 2", "초급 · Elementary"),
    "L3": ("Level 3", "중급 입구 · Pre-Intermediate"),
    "L4": ("Level 4", "중급 · Intermediate"),
    "L5": ("Level 5", "중상급 · Upper-Intermediate"),
    "L6": ("Level 6", "고급 · Advanced"),
}

TIER_LABEL = {
    "core": "핵심 문법",
    "preview": "미리보기",
    "foundation": "개념 기초",
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
header.site a{color:#fff;text-decoration:none;font-weight:700;letter-spacing:.5px}
header.site span{color:var(--teal)}
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
footer{border-top:1px solid var(--line);margin-top:44px;padding-top:18px;color:var(--mute);font-size:14px}
@media(max-width:600px){body{font-size:16px}h1{font-size:25px}main{padding:20px 16px 50px}}
"""


def page(title, desc, body, canonical, jsonld=None):
    ld = ""
    if jsonld:
        ld = ('\n<script type="application/ld+json">'
              + json.dumps(jsonld, ensure_ascii=False) + "</script>")
    note = f"<br>{LICENSE_NOTE}" if LICENSE_NOTE else ""
    beacon = ""
    if CF_ANALYTICS_TOKEN.strip():
        tok = json.dumps({"token": CF_ANALYTICS_TOKEN.strip()}, ensure_ascii=False)
        beacon = ('\n<script defer src="https://static.cloudflareinsights.com/beacon.min.js" '
                  f"data-cf-beacon='{tok}'></script>")
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
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700&display=swap" rel="stylesheet">
<style>{CSS}</style>{ld}
</head>
<body>
<header class="site"><a href="/learn/">Doran<span>chae</span> · 한국어 학습 자료</a></header>
<main>
{body}
<footer>
{esc(LICENSE_LINE)}{note}<br>
<a href="/">Doranchae 홈</a> · <a href="/learn/">학습 자료 전체</a> · <a href="/license.html">이용 조건</a>
</footer>
</main>{beacon}
</body>
</html>
"""


# ─────────────────────────────────────────────────────────────
# 문법 카드 렌더링
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
    parts.append(f"<a class='cta' href='/nhs.html'>▶ 앱에서 이 편 학습하기 — 무료</a>")
    return "\n".join(parts)


# ─────────────────────────────────────────────────────────────
# 에피소드 페이지
# ─────────────────────────────────────────────────────────────

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

    parts.append(f"<a class='cta' href='/nhs.html'>▶ 앱에서 이 편 학습하기 — 무료</a>")
    return "\n".join(parts)


# ─────────────────────────────────────────────────────────────
# 빌드
# ─────────────────────────────────────────────────────────────

def build(levels):
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

    urls = []
    hub = {}
    used_slugs = set()
    n_gram = 0

    for lv in levels:
        files = sorted((DATA / lv).glob("ep*.json"))
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
                desc = meta_desc(g.get("explanation_en") or g.get("rule") or g.get("title_en"))
                canon = f"{SITE}/learn/grammar/{slug}.html"
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
                gp = OUT / "grammar" / f"{slug}.html"
                gp.write_text(page(title, desc, grammar_body(g, ep, lv, ep_slug), canon, ld),
                              encoding="utf-8")
                written.add(gp)
                urls.append(f"/learn/grammar/{slug}.html")
                gram_links.append((slug, g["title"], g.get("title_en", "")))
                n_gram += 1

            title = f"{ep['title']} — {lvl_name} 한국어 에피소드 | Doranchae"
            desc = meta_desc((ep.get("goal") or {}).get("ko"), ep.get("title_en"))
            canon = f"{SITE}/learn/episode/{ep_slug}.html"
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
            epp = OUT / "episode" / f"{ep_slug}.html"
            epp.write_text(page(title, desc, episode_body(ep, lv, gram_links), canon, ld),
                           encoding="utf-8")
            written.add(epp)
            urls.append(f"/learn/episode/{ep_slug}.html")
            hub[lv].append((ep_slug, ep["title"], ep.get("title_en", ""), gram_links))

    # ── 허브 ──
    b = ["<h1>한국어 학습 자료<span class='en'>Free Korean lessons — grammar, vocabulary, stories</span></h1>",
         "<p class='lead'>이야기로 시작해서 문법으로 이어집니다. 여기 있는 설명은 미리 보기이고, "
         "이야기·음성·연습 문제는 앱에서 이어집니다.</p>",
         f"<a class='cta' href='/nhs.html'>▶ 앱에서 학습 시작하기 — 무료</a>"]
    for lv in levels:
        lvl_name, lvl_desc = LEVEL_LABEL.get(lv, (lv, ""))
        b.append(f"<h2>{esc(lvl_name)} · {esc(lvl_desc)}</h2><div class='cards'>")
        for slug, t, te, _ in hub[lv]:
            b.append(f"<a class='card' href='/learn/episode/{slug}.html'>"
                     f"<b>{esc(t)}</b><span>{esc(te)}</span></a>")
        b.append("</div>")
        b.append("<h3>문법 항목</h3><div class='cards'>")
        for _, _, _, gl in hub[lv]:
            for slug, t, te in gl:
                b.append(f"<a class='card' href='/learn/grammar/{slug}.html'>"
                         f"<b>{esc(t)}</b><span>{esc(te)}</span></a>")
        b.append("</div>")
    written.add(OUT / "index.html")
    (OUT / "index.html").write_text(
        page("한국어 학습 자료 — 문법·어휘·이야기 | Doranchae",
             "한국어 문법 설명과 어휘, 이야기 기반 에피소드. 한국어 선생님이 직접 만든 학습 자료입니다.",
             "\n".join(b), f"{SITE}/learn/"),
        encoding="utf-8")
    urls.insert(0, "/learn/")

    # ── sitemap · robots ──
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

    print(f"✅ 레벨 {', '.join(levels)}")
    print(f"   문법 페이지   {n_gram}개")
    print(f"   에피소드 페이지 {sum(len(v) for v in hub.values())}개")
    print(f"   sitemap URL   {len(urls) + 4}개")
    print(f"   → {OUT}")
    stale = sorted(before - written)
    if stale:
        print(f"\n\u26a0\ufe0f  \uc774\uc804 \ube4c\ub4dc\uc758 \uc606 \ud30c\uc77c {len(stale)}\uac1c\uac00 \ub0a8\uc558\uc2b5\ub2c8\ub2e4 (\uc774 \ud658\uacbd\uc740 \uc0ad\uc81c \uad8c\ud55c\uc774 \uc5c6\uc74c).")
        print("   \ub0b4 \ucef4\ud4e8\ud130\uc5d0\uc11c \uc774 \uc2a4\ud06c\ub9bd\ud2b8\ub97c \ud55c \ubc88 \ub2e4\uc2dc \ub3cc\ub9ac\uba74 \uc790\ub3d9\uc73c\ub85c \uc815\ub9ac\ub429\ub2c8\ub2e4.")
        for q in stale[:5]:
            print(f"   \u00b7 {q.relative_to(ROOT).as_posix()}")
        if len(stale) > 5:
            print(f"   \u00b7 \u2026 \uc678 {len(stale)-5}\uac1c")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--levels", nargs="+", default=None)
    ap.add_argument("--all", action="store_true")
    a = ap.parse_args()
    build(ALL_LEVELS if a.all else (a.levels or DEFAULT_LEVELS))
