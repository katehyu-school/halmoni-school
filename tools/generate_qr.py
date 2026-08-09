# -*- coding: utf-8 -*-
"""Doranchae QR 코드 생성기 — segno로 QR 생성, PIL로 소개 카드 합성.
사용법: python3 generate_qr.py
출력: qr/QR_Doranchae.png · qr/QR_Doranchae_Mobile.png · qr/Doranchae_QR카드.png
"""
import segno
from PIL import Image, ImageDraw, ImageFont
import io, os

OUT_DIR = "/sessions/beautiful-elegant-pascal/mnt/outputs/qr"
os.makedirs(OUT_DIR, exist_ok=True)

WEB_URL = "https://doranchae.com/"
MOBILE_URL = "https://doranchae.com/hq-mobile.html"

NAVY = (10, 47, 58)
TEAL = (61, 189, 181)
WHITE = (255, 255, 255)
GRAY = (140, 150, 155)
DARK_TXT = (20, 35, 40)

FONT_DIR = "/usr/share/fonts/opentype/noto/"
def font(name, size):
    return ImageFont.truetype(FONT_DIR + name, size)

f_title   = font("NotoSansCJK-Bold.ttc", 46)
f_sub     = font("NotoSansCJK-Regular.ttc", 20)
f_label   = font("NotoSansCJK-Bold.ttc", 26)
f_name    = font("NotoSansCJK-Bold.ttc", 28)
f_desc    = font("NotoSansCJK-Regular.ttc", 17)
f_domain  = font("NotoSansCJK-Bold.ttc", 19)
f_footer  = font("NotoSansCJK-Bold.ttc", 26)

def make_qr_png(url, path, scale=10, border=2, dark="#0A2F3A"):
    qr = segno.make(url, error='h')
    qr.save(path, scale=scale, border=border, dark=dark, light="white")

def qr_to_pil(url, box_px, dark="#0A2F3A"):
    qr = segno.make(url, error='h')
    buf = io.BytesIO()
    qr.save(buf, kind='png', scale=20, border=1, dark=dark, light="white")
    buf.seek(0)
    im = Image.open(buf).convert("RGB")
    return im.resize((box_px, box_px), Image.LANCZOS)

def centered_text(draw, cx, y, text, fnt, fill, anchor="mm"):
    draw.text((cx, y), text, font=fnt, fill=fill, anchor=anchor)

def rounded_rect(draw, box, radius, outline, width):
    draw.rounded_rectangle(box, radius=radius, outline=outline, width=width)

# ---- 1) 단독 QR 파일 (기존 파일명 패턴 유지, 브랜드만 교체) ----
make_qr_png(WEB_URL, f"{OUT_DIR}/QR_Doranchae.png", scale=10, border=3)
make_qr_png(MOBILE_URL, f"{OUT_DIR}/QR_Doranchae_Mobile.png", scale=10, border=3)

# ---- 2) 소개용 카드 (기존 HangeulQuest_QR카드.png와 동일 레이아웃) ----
W, H = 1400, 1000
card = Image.new("RGB", (W, H), WHITE)
d = ImageDraw.Draw(card)

# header
d.rectangle([0, 0, W, 160], fill=NAVY)
centered_text(d, W/2, 60, "DORANCHAE", f_title, TEAL)
centered_text(d, W/2, 110, "한국어를 에피소드로 배웁니다", f_sub, WHITE)

# divider
d.line([700, 190, 700, 900], fill=(225, 225, 225), width=2)

# left panel — web
centered_text(d, 350, 215, "도란채 · 웹", f_label, NAVY)
qr_web = qr_to_pil(WEB_URL, 470, dark="#0A2F3A")
qr_x, qr_y = 350 - 235, 240
rounded_rect(d, [qr_x-2, qr_y-2, qr_x+474, qr_y+474], radius=22, outline=TEAL, width=4)
card.paste(qr_web, (qr_x, qr_y))
centered_text(d, 350, 762, "Doranchae", f_name, NAVY)
centered_text(d, 350, 800, "에피소드로 배우는 한국어", f_desc, GRAY)
centered_text(d, 350, 848, "doranchae.com/", f_domain, TEAL)

# right panel — mobile
centered_text(d, 1050, 215, "도란채 · 모바일 앱", f_label, NAVY)
qr_mob = qr_to_pil(MOBILE_URL, 470, dark="#0A2F3A")
qr_x2, qr_y2 = 1050 - 235, 240
rounded_rect(d, [qr_x2-2, qr_y2-2, qr_x2+474, qr_y2+474], radius=22, outline=NAVY, width=4)
card.paste(qr_mob, (qr_x2, qr_y2))
centered_text(d, 1050, 762, "Doranchae Mobile", f_name, NAVY)
centered_text(d, 1050, 800, "하루 5분 복습 · 폰에 추가하세요", f_desc, GRAY)
centered_text(d, 1050, 848, "doranchae.com/hq-mobile.html", f_domain, NAVY)

# footer
d.rectangle([0, 920, W, H], fill=TEAL)
centered_text(d, W/2, 960, "doranchae.com", f_footer, WHITE)

card.save(f"{OUT_DIR}/Doranchae_QR카드.png")

print("done:", os.listdir(OUT_DIR))
