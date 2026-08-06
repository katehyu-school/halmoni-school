# -*- coding: utf-8 -*-
"""
슬라이드 PNG → WebP 변환 (2026-08-06 최초 사용)

왜 필요한가
  Google Vids에서 내보낸 슬라이드는 960x540인데도 한 장에 1.1MB입니다.
  사진 배경을 PNG로 저장해서 그렇습니다. WebP로 바꾸면 약 15배 작아지고
  눈으로는 차이를 알 수 없습니다(말풍선 글자 3배 확대해도 동일).

언제 쓰나
  새 에피소드 슬라이드를 폴더에 넣은 뒤, JSON에 경로를 적기 전에 한 번 돌립니다.
  이미 .webp가 있으면 건너뛰므로 여러 번 실행해도 안전합니다.

사용법
  python3 tools/png_to_webp.py                 # data/ 전체 훑기
  python3 tools/png_to_webp.py data/nhs/L6     # 특정 폴더만

변환한 뒤 할 일
  1) JSON·HTML의 경로를 .png → .webp 로 바꿉니다
  2) 원본 PNG는 git에서 지웁니다(히스토리에 남으므로 언제든 복구 가능):
       git rm "data/*.png"
"""
import os, sys
from PIL import Image, ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True   # 끝이 조금 잘린 PNG도 살려서 변환

QUALITY_SLIDE   = 85   # 슬라이드(사진 배경 + 말풍선)
QUALITY_DIAGRAM = 94   # 도식·표처럼 글자가 많은 그림

def main(root='data'):
    done = skipped = failed = 0
    before = after = 0
    for dirpath, _, files in os.walk(root):
        for f in files:
            if not f.lower().endswith('.png'):
                continue
            src = os.path.join(dirpath, f)
            dst = src[:-4] + '.webp'
            if os.path.exists(dst):
                skipped += 1
                continue
            q = QUALITY_DIAGRAM if 'basics' in dirpath else QUALITY_SLIDE
            try:
                im = Image.open(src)
                im.load()
                if im.mode == 'RGBA':                     # 투명 배경은 흰색으로
                    bg = Image.new('RGB', im.size, (255, 255, 255))
                    bg.paste(im, mask=im.split()[3])
                    im = bg
                elif im.mode != 'RGB':
                    im = im.convert('RGB')
                im.save(dst, 'WEBP', quality=q, method=4)
                before += os.path.getsize(src)
                after  += os.path.getsize(dst)
                done += 1
            except Exception as e:
                failed += 1
                print('실패:', src, e)
    print(f'변환 {done} · 건너뜀 {skipped} · 실패 {failed}')
    if done:
        print(f'{before/1024/1024:.0f}MB → {after/1024/1024:.0f}MB '
              f'({before/after:.1f}배 작아짐)')

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'data')
