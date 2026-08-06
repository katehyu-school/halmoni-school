# -*- coding: utf-8 -*-
"""
Google 슬라이드 PDF → 슬라이드별 WebP (2026-08-06 신설)

왜 이렇게 하나
  Google 슬라이드는 이미지로 내보낼 때 "현재 슬라이드" 한 장씩만 됩니다.
  20장이면 20번 눌러야 하죠. PDF는 전체가 한 파일로 나오므로
  다운로드 한 번이면 끝나고, 나머지는 이 스크립트가 합니다.

사용법
  python3 tools/pdf_slides_to_webp.py <PDF파일> <내보낼폴더> [파일이름앞부분]

  예)
  python3 tools/pdf_slides_to_webp.py ~/Downloads/창덕궁관람.pdf \
          data/nhs/L5/slides/ep05 창덕궁관람

  → 창덕궁관람1.webp, 창덕궁관람2.webp … 로 저장됩니다.
     (기존 슬라이드 파일명 규칙과 같습니다: 제목 + 번호, 1부터 시작)

크기
  기본 960x540 — 지금까지 만든 슬라이드와 같은 크기입니다.
  더 크게 하려면 --width 1280 처럼 붙이세요. 용량이 그만큼 늘어납니다.
"""
import os, sys, argparse

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pdf')
    ap.add_argument('outdir')
    ap.add_argument('prefix', nargs='?', default=None,
                    help='파일 이름 앞부분. 없으면 PDF 파일 이름을 씁니다')
    ap.add_argument('--width', type=int, default=960)
    ap.add_argument('--quality', type=int, default=85)
    ap.add_argument('--start', type=int, default=1, help='번호 시작값')
    a = ap.parse_args()

    try:
        import fitz  # PyMuPDF
    except ImportError:
        print('PyMuPDF가 필요합니다:  pip install pymupdf --break-system-packages')
        sys.exit(1)
    from PIL import Image
    import io

    prefix = a.prefix or os.path.splitext(os.path.basename(a.pdf))[0]
    os.makedirs(a.outdir, exist_ok=True)

    doc = fitz.open(a.pdf)
    total = 0
    for i, page in enumerate(doc):
        # 페이지 실제 폭에 맞춰 배율을 잡아 원하는 가로 크기를 얻습니다
        zoom = a.width / page.rect.width
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
        im = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
        out = os.path.join(a.outdir, f'{prefix}{a.start + i}.webp')
        im.save(out, 'WEBP', quality=a.quality, method=4)
        total += os.path.getsize(out)
        print(f'  {os.path.basename(out)}  {im.size[0]}x{im.size[1]}  '
              f'{os.path.getsize(out)/1024:.0f}KB')
    print(f'\n{len(doc)}장 저장 · 합계 {total/1024/1024:.1f}MB · → {a.outdir}')
    print('\n다음 할 일: 에피소드 JSON의 slides 배열에 이 경로들을 넣으세요.')

if __name__ == '__main__':
    main()
