"""Genera los assets web optimizados a partir de notes/curated (local, gitignored).
Uso: python3 -I scripts/build-media.py  — salida en public/media/"""
import json, os, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'notes', 'curated')
OUT = os.path.join(ROOT, 'public', 'media')
os.makedirs(OUT, exist_ok=True)

def save(im, name, q=78):
    p = os.path.join(OUT, name)
    im.save(p, 'WEBP', quality=q, method=6)
    print(f'{name:40s} {im.size[0]}x{im.size[1]}  {os.path.getsize(p)//1024} KB')

# --- Hero: capas de papel (alpha normalizado; la opacidad se controla en canvas)
for src, name in [('layer-far-skyline', 'hero-far'), ('layer-near-skyline', 'hero-near'), ('layer-clouds', 'hero-clouds')]:
    im = Image.open(os.path.join(SRC, 'hero', src + '.png')).convert('RGBA')
    if name != 'hero-clouds':
        a = im.getchannel('A').point(lambda v: 255 if v > 8 else 0)
        im.putalpha(a)
    save(im.resize((1800, 600), Image.LANCZOS), name + '.webp', 80)

# --- Hero: atlas de personajes (filas 0-2 de la hoja; las filas 3-6 son duplicados)
sheet = Image.open(os.path.join(SRC, 'hero', 'open-peeps-sheet-CC0.png')).convert('RGBA')
CW, CH = 240, 324
skip = {(0, 8), (1, 12), (1, 14)}  # ventana, zapatos, nube: no son personajes
H = 136  # alto de cada personaje en el atlas (dibujado a ≤132 px CSS)
figs = []
for r in range(3):
    for c in range(15):
        if (r, c) in skip:
            continue
        cell = sheet.crop((c * CW, r * CH, (c + 1) * CW, (r + 1) * CH))
        bbox = cell.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
        if not bbox:
            continue
        cell = cell.crop(bbox)
        w = round(cell.width * H / cell.height)
        figs.append(cell.resize((w, H), Image.LANCZOS))
# 30 personajes alcanzan (en pantalla hay ≤20 a la vez) y mantienen el hero bajo 250 KB
figs = [f for i, f in enumerate(figs) if i % 7 not in (3, 6)][:30]
cols = 10
rows = (len(figs) + cols - 1) // cols
cellw = max(f.width for f in figs)
atlas = Image.new('RGBA', (cols * cellw, rows * H), (0, 0, 0, 0))
meta = []
for i, f in enumerate(figs):
    x, y = (i % cols) * cellw, (i // cols) * H
    atlas.paste(f, (x, y))
    meta.append([x, y, f.width, H])
save(atlas, 'crowd-atlas.webp', 58)
with open(os.path.join(OUT, 'crowd-atlas.json'), 'w') as fh:
    json.dump({'frames': meta}, fh)
print('crowd figures:', len(meta))

# --- Portadas con redacción (datos personales tapados con el color de fondo)
def redact(im, boxes, fill):
    d = ImageDraw.Draw(im)
    for b in boxes:
        d.rectangle(b, fill=fill)
    return im

im = Image.open(os.path.join(SRC, 'aseguradora-del-sur', '04-driver-score.png')).convert('RGB')
redact(im, [(340, 206, 410, 228), (290, 227, 410, 246)], (255, 255, 255))  # placa + póliza
save(im, 'aseg-2021-driver-score.webp', 82)
im = Image.open(os.path.join(SRC, 'aseguradora-del-sur', '01-initial-proposal-home.png')).convert('RGB')
save(im.resize((414, round(im.height * 414 / im.width)), Image.LANCZOS), 'aseg-2019-proposal.webp', 82)

im = Image.open(os.path.join(SRC, 'maresa-guc', '03-v2-dashboard.png')).convert('RGB')
im = redact(im, [(292, 407, 592, 433)], (236, 236, 236))  # nombre de asesor
save(im.crop((270, 300, 1400, 815)), 'maresa-funnel.webp', 80)

im = Image.open(os.path.join(SRC, 'work', 'aerialoop', '01-active-order-web.png')).convert('RGB')
im = redact(im, [(760, 818, 1300, 866)], (255, 255, 255))  # destino + teléfono
save(im.crop((448, 160, 1472, 880)).resize((768, 540), Image.LANCZOS), 'aerialoop-tracking.webp', 80)

im = Image.open(os.path.join(SRC, 'work', 'gps-installers', '01-task-board.png')).convert('RGB')
names = [(540, 238, 640, 252), (962, 238, 1062, 252), (1384, 238, 1484, 252),
         (962, 419, 1062, 433), (962, 615, 1062, 629)]
redact(im, names, (255, 255, 255))
save(im.crop((466, 145, 1700, 730)).resize((864, 410), Image.LANCZOS), 'gps-board.webp', 80)

# --- Ilustración personal
for f in ['01.jpg', '02.jpg', '03.jpg', '04.jpg', 'mesa-de-trabajo-1600.png', 'artboard-1600.png']:
    im = Image.open(os.path.join(SRC, 'illustration', f)).convert('RGB')
    h = 640
    im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
    save(im, 'illo-' + os.path.splitext(f)[0] + '.webp', 78)

# ============================================================
# Handoff "Paper City" (notes/design_handoff_paper_city)
# ============================================================
from PIL import ImageChops, ImageOps

HANDOFF = os.path.join(ROOT, 'notes', 'design_handoff_paper_city', 'assets')

def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def tint(src, color, solid_alpha=True, lo=212):
    """Tiñe un escaneo: el alfa es la máscara y la luminancia conserva la textura del papel."""
    im = Image.open(os.path.join(SRC, 'hero', src + '.png')).convert('RGBA')
    alpha = im.getchannel('A')
    if solid_alpha:
        alpha = alpha.point(lambda v: 255 if v > 8 else 0)
    lum = ImageOps.autocontrast(im.convert('L'), cutoff=2).point(lambda v: lo + v * (255 - lo) // 255)
    fill = Image.new('RGB', im.size, hex_rgb(color))
    out = ImageChops.multiply(fill, Image.merge('RGB', (lum, lum, lum))).convert('RGBA')
    out.putalpha(alpha)
    return out

def with_shadow(im, dy, blur, opacity):
    """Sombra de papel horneada (equivale al drop-shadow del handoff, sin costo por frame)."""
    a = im.getchannel('A')
    sh = Image.new('RGBA', im.size, (46, 43, 37, 0))
    sh.putalpha(a.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: int(v * opacity)))
    base = Image.new('RGBA', im.size, (0, 0, 0, 0))
    base.alpha_composite(sh, (0, dy))
    base.alpha_composite(im)
    return base

from PIL import ImageFilter
save(with_shadow(tint('layer-far-skyline', '#ccdbb2'), -8, 18, 0.16).resize((1800, 600), Image.LANCZOS), 'pc-back.webp', 68)
save(with_shadow(tint('layer-near-skyline', '#ffc6a5'), -10, 20, 0.2).resize((1800, 600), Image.LANCZOS), 'pc-mid.webp', 68)
clouds = Image.open(os.path.join(SRC, 'hero', 'layer-clouds.png')).convert('RGBA')
ink = Image.new('RGBA', clouds.size, hex_rgb('#645c50') + (255,))
ink.putalpha(clouds.getchannel('A'))
save(ink.resize((1800, 600), Image.LANCZOS), 'pc-clouds.webp', 80)

# Grano: tile de 220 px (equivalente estático del feTurbulence del prototipo)
import random
random.seed(7)
g = Image.new('L', (220, 220))
g.putdata([random.randint(0, 255) for _ in range(220 * 220)])
from PIL import ImageFilter
g = g.filter(ImageFilter.GaussianBlur(0.8))
g = ImageOps.autocontrast(g)
grain = Image.new('RGBA', (220, 220), (51, 38, 26, 0))
grain.putalpha(g.point(lambda v: int(max(0, v - 90) * 0.42)))
save(grain, 'grain.webp', 50)

def cover(im, boxes, sample=None):
    """Tapa zonas con el color de fondo muestreado (o el color dado)."""
    d = ImageDraw.Draw(im)
    for b in boxes:
        box, fill = (b, None) if len(b) == 4 else (b[:4], b[4])
        if fill is None:
            fill = im.getpixel(sample or (box[0] - 3, box[1] + 2))
        d.rectangle(box, fill=fill)
    return im

def phone(name, boxes=(), sample=None):
    im = Image.open(os.path.join(HANDOFF, name + '.png')).convert('RGB')
    cover(im, boxes, sample)
    im = im.crop((0, 0, im.width, round(im.width * 2)))  # 9:18 desde arriba
    for w, suf in ((300, '@1x'), (im.width, '@2x')):  # @2x = ancho nativo, sin ampliar
        save(im.resize((w, w * 2), Image.LANCZOS), f'w-{name}{suf}.webp', 80)

WHITE = (255, 255, 255)
# asdr-home: póliza, nombres de calles/barrio, números de siniestro/asistencia
phone('asdr-home', [
    (238, 104, 408, 122, WHITE),
    (20, 346, 395, 370, WHITE), (20, 482, 395, 506, WHITE), (20, 600, 395, 624, WHITE),
    (20, 733, 395, 757, WHITE), (20, 847, 395, 871, WHITE),
    (290, 374, 395, 400, WHITE), (285, 628, 395, 654, WHITE),
])
# asdr-score: placa, motor, chasis (VIN), póliza
phone('asdr-score', [(12, 148, 248, 244, WHITE), (244, 146, 408, 186, WHITE)])
phone('asdr-services')
# aerialoop-home: ID de cliente y dirección de entrega
phone('aerialoop-home', [(8, 56, 215, 76, WHITE), (60, 320, 282, 346, WHITE)])
phone('aerialoop-login-3')
# aerialoop-login-4: dirección escrita y el párrafo que la repite
login4 = Image.open(os.path.join(HANDOFF, 'aerialoop-login-4.png')).convert('RGB')
blue = login4.getpixel((30, 600))
field = login4.getpixel((200, 568))
cover(login4, [(72, 556, 322, 582, field), (28, 604, 334, 676, blue)])
login4.save(os.path.join(ROOT, 'notes', 'curated', 'work', 'aerialoop', '_login4-redacted.png'))
phone_im = login4.crop((0, 0, 360, 720))
for w, suf in ((300, '@1x'), (360, '@2x')):
    save(phone_im.resize((w, w * 2), Image.LANCZOS), f'w-aerialoop-login-4{suf}.webp', 80)

# guc-delivery (1440 px de ancho): datos del cliente y asesor; recorte 16:10 desde arriba
guc = Image.open(os.path.join(HANDOFF, 'guc-delivery.png')).convert('RGB')
cover(guc, [(568, 204, 700, 272, (241, 241, 241)), (350, 432, 525, 456, (236, 236, 236))])
guc = guc.crop((0, 0, 1440, 900))
for w, suf in ((800, '@1x'), (1440, '@2x')):
    save(guc.resize((w, round(w * 900 / 1440)), Image.LANCZOS), f'w-guc-delivery{suf}.webp', 80)

# Puntaje de conducción (curated, ya usado antes): placa + póliza tapadas
score = Image.open(os.path.join(SRC, 'aseguradora-del-sur', '04-driver-score.png')).convert('RGB')
redact(score, [(340, 206, 410, 228), (290, 227, 410, 246)], (255, 255, 255))
score = score.crop((0, 0, score.width, score.width * 2))
for w, suf in ((300, '@1x'), (score.width, '@2x')):
    save(score.resize((w, w * 2), Image.LANCZOS), f'w-asdr-rating{suf}.webp', 80)

# ============================================================
# Drawings: curaduría de notes/diseño (alias "El Junta")
# ============================================================
import glob
DIS = os.path.join(ROOT, 'notes', 'diseño')

def find_dis(pattern):
    m = sorted(glob.glob(os.path.join(DIS, pattern)))
    if not m:
        raise SystemExit(f'falta {pattern}')
    return m[0]

DRAWINGS = [
    ('cadaveres', 'Captura*2.22.12*'),
    ('spotlight', 'Captura*2.22.56*'),
    ('wordmark', 'Captura*2.21.51*'),
    ('andean-mask', 'Mesa de trabajo 1600.png'),
    ('lion-mask', 'Artboard 1.png'),
    ('poster-alertas', '01.jpg'),
    ('poster-doblar', '03.jpg'),
    ('poster-doblar-2', '04.jpg'),
]
for slug, pattern in DRAWINGS:
    im = Image.open(find_dis(pattern)).convert('RGB')
    for h, suf in ((440, '@1x'), (880, '@2x')):
        hh = min(h, im.height)
        save(im.resize((round(im.width * hh / im.height), hh), Image.LANCZOS), f'd-{slug}{suf}.webp', 80)

# ============================================================
# AI-TimeTracker: capturas reales sin logo ni nombre de la empresa
# ============================================================
TT = os.path.join(SRC, 'now-timetracker')

def wide(im, name, widths=(800, 1440)):
    for w, suf in zip(widths, ('@1x', '@2x')):
        w = min(w, im.width)
        save(im.resize((w, round(im.height * w / im.width)), Image.LANCZOS), f'w-{name}{suf}.webp', 80)

tl = Image.open(os.path.join(TT, '00-ORIGINAL-timelog-reference-only.png')).convert('RGB')  # 2988×1716, k≈1.494
k = tl.width / 2000
side = tl.getpixel((12, 140))
cover(tl, [(14, 14, round(222 * k), round(66 * k), side)])  # logo
# Sufijo "— Capmation …" en la columna Proyecto: (fila, x donde empieza el guion)
for row, x0 in ((319, 1139), (394, 1071), (469, 1139), (544, 1139)):
    y = round(row * k)
    bg = tl.getpixel((round(1004 * k), y))  # padding izquierdo de la celda
    cover(tl, [(round(x0 * k), y - round(16 * k), round(1276 * k), y + round(16 * k), bg)])
wide(tl.crop((0, 0, tl.width, round(1075 * k))), 'tt-timelog')

db = Image.open(os.path.join(TT, '00-ORIGINAL-dashboard-reference-only.png')).convert('RGB')  # 3024×1712
k = db.width / 2000
side = db.getpixel((12, 140))
cover(db, [(14, 10, round(218 * k), round(62 * k), side)])
wide(db, 'tt-dashboard')

# ============================================================
# Document Folders: detalles del Figma original, sin marca ni cliente
# ============================================================
Image.MAX_IMAGE_PIXELS = None
fig = Image.open(os.path.join(SRC, 'document-folders', '00-ORIGINAL-reference-only.png')).convert('RGB')
wide(fig.crop((4330, 3640, 5960, 4690)), 'df-tree')
wide(fig.crop((6170, 3560, 7090, 4070)), 'df-delete', widths=(460, 920))
