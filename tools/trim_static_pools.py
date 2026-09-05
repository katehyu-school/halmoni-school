# -*- coding: utf-8 -*-
"""
정적 학습 풀 파일에서 '잠긴 레벨(L3+)' 부분을 잘라냅니다. (2026-09-05 신설)

배경
  data/nhs/*.json 은 GitHub Pages에 그대로 올라가는 공개 파일이라, 주소만 알면
  누구나 받을 수 있습니다. 그래서 무료 공개인 L1·L2만 이 파일들에 남기고,
  Level 3 이상은 Supabase(nhs_pool 테이블)로 옮겼습니다.
  → 올리는 것은 tools/pool-sync.html (브라우저에서 클릭), 잘라내는 것은 이 스크립트.

쓰는 때
  ① 최초 이관 직후 (Supabase 업로드를 확인한 다음!)
  ② 나중에 실수로 L3+ 내용이 정적 파일에 다시 들어갔을 때 청소용

  python3 tools/trim_static_pools.py --check   # 무엇이 잘릴지 보기만 함
  python3 tools/trim_static_pools.py --apply    # 실제로 잘라냄

⚠️ Supabase에 올라간 것을 확인하기 전에는 --apply 하지 마세요. 되돌리려면 git.
"""
import json, sys, os

OPEN_MAX = 2   # L1·L2 = 무료 공개
BASE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'nhs')

# (파일, 종류) — dict: 키가 L4_ep05 형태 / arr: 항목마다 lv·ep / all: 통째로 잠긴 것
FILES = [('reading_pool.json','dict'), ('spacing_pool.json','dict'),
         ('writing_pool.json','dict'), ('glossary_pool.json','dict'),
         ('vocab_index.json','arr'),   ('honorific_grammar_index.json','arr'),
         ('shared_expression_sets.json','all')]

def lv_of(key):
    try: return int(str(key).replace('L','').split('_')[0])
    except Exception: return 0

def trim(path, kind):
    with open(path, encoding='utf-8') as f:
        raw = f.read()
    d = json.loads(raw)
    if kind == 'dict':
        kept = {k: v for k, v in d.items() if lv_of(k) <= OPEN_MAX}
        cut  = len(d) - len(kept)
    elif kind == 'arr':
        kept = [it for it in d if lv_of(it.get('lv','')) <= OPEN_MAX]
        cut  = len(d) - len(kept)
    else:
        kept, cut = {}, len(d)
    return kept, cut, len(d)

def main():
    apply = '--apply' in sys.argv
    if not apply and '--check' not in sys.argv:
        print(__doc__); return
    for name, kind in FILES:
        path = os.path.join(BASE, name)
        if not os.path.exists(path):
            print(f'  {name:34s} 파일 없음 — 건너뜀'); continue
        kept, cut, before = trim(path, kind)
        after = len(kept)
        print(f'  {name:34s} {before:5d} → {after:5d}  (잘라낼 것 {cut})')
        if apply and cut:
            tmp = path + '.tmp'
            with open(tmp, 'w', encoding='utf-8') as f:
                json.dump(kept, f, ensure_ascii=False, indent=1)
                f.write('\n')
            os.replace(tmp, path)
    print('\n적용됨 — git diff 로 확인하세요.' if apply else '\n확인만 했습니다 (--apply 를 붙이면 실제로 잘라냅니다).')

if __name__ == '__main__':
    main()
