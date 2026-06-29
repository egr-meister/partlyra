"""
generate_assets.py — regenerates Partlyra's custom icon and splash.

These PNGs are committed (icon.png, adaptive-icon.png, favicon.png, splash.png),
so you do NOT need to run this to build the app. It is kept only to document
how the artwork was produced and to let you tweak the palette.

Requires Pillow:  pip install pillow
Run:              python assets/generate_assets.py

Concept: a pale beige storage drawer (with handle + shelf line) on a muted
steel-blue rounded tile, a small teal "part" dot, and an amber label tag with
a check mark — readable at small sizes, no heavy assets.
"""

from PIL import Image, ImageDraw, ImageFont

STEEL = (74, 92, 106)
STEEL_DARK = (58, 73, 85)
BEIGE = (233, 227, 215)
TEAL = (62, 142, 132)
AMBER = (212, 154, 42)
LIGHTGRAY = (241, 240, 236)


def rounded(size, radius, color):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=color)
    return img, d


def draw_drawer(d, cx, cy, w, h, fill, outline, ow):
    x0, y0 = cx - w // 2, cy - h // 2
    x1, y1 = cx + w // 2, cy + h // 2
    r = max(8, w // 14)
    d.rounded_rectangle([x0, y0, x1, y1], radius=r, fill=fill, outline=outline, width=ow)
    midy = y0 + int(h * 0.46)
    d.line([x0 + ow, midy, x1 - ow, midy], fill=outline, width=max(2, ow // 2))
    hw = int(w * 0.30)
    hh = max(6, int(h * 0.07))
    hx = cx - hw // 2
    hy = y0 + int(h * 0.72)
    d.rounded_rectangle([hx, hy, hx + hw, hy + hh], radius=hh // 2, fill=outline)


def add_accents(d, cx, cy, w, h, dot_r, tw, check_w):
    d.ellipse(
        [cx - int(w * 0.30) - dot_r, cy - int(h * 0.22) - dot_r,
         cx - int(w * 0.30) + dot_r, cy - int(h * 0.22) + dot_r],
        fill=TEAL,
    )
    tx = cx + int(w * 0.16)
    ty = cy - int(h * 0.30)
    d.rounded_rectangle([tx, ty, tx + tw, ty + tw], radius=max(3, tw // 5), fill=AMBER)
    d.line([tx + tw * 0.22, ty + tw * 0.52, tx + tw * 0.42, ty + tw * 0.72],
           fill=(255, 255, 255), width=check_w)
    d.line([tx + tw * 0.42, ty + tw * 0.72, tx + tw * 0.78, ty + tw * 0.28],
           fill=(255, 255, 255), width=check_w)


def make_icon(size, fname, with_bg=True):
    img, d = rounded(size, int(size * 0.22), STEEL if with_bg else (0, 0, 0, 0))
    w, h = int(size * 0.56), int(size * 0.50)
    cx, cy = size // 2, int(size * 0.52)
    draw_drawer(d, cx, cy, w, h, BEIGE, STEEL_DARK, max(3, size // 42))
    add_accents(d, cx, cy, w, h, max(4, int(size * 0.055)),
                int(size * 0.14), max(2, size // 40))
    img.save(fname)
    print("saved", fname)


def make_adaptive():
    size = 1024
    fg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(fg)
    w, h = int(size * 0.46), int(size * 0.42)
    cx, cy = size // 2, size // 2
    draw_drawer(d, cx, cy, w, h, BEIGE, STEEL_DARK, 22)
    add_accents(d, cx, cy, w, h, int(size * 0.045), int(size * 0.12), 20)
    fg.save("adaptive-icon.png")
    print("saved adaptive-icon.png")


def load_font(sz):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
              "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]:
        try:
            return ImageFont.truetype(p, sz)
        except Exception:
            pass
    return ImageFont.load_default()


def make_splash():
    sw, sh = 1284, 2778
    sp = Image.new("RGBA", (sw, sh), LIGHTGRAY)
    d = ImageDraw.Draw(sp)
    cx, cy = sw // 2, int(sh * 0.42)
    w, h = int(sw * 0.42), int(sw * 0.40)
    draw_drawer(d, cx, cy, w, h, BEIGE, STEEL, 12)
    add_accents(d, cx, cy, w, h, int(sw * 0.030), int(sw * 0.10), 10)
    title_font = load_font(150)
    sub_font = load_font(64)
    t = "Partlyra"
    tb = d.textbbox((0, 0), t, font=title_font)
    d.text((cx - (tb[2] - tb[0]) // 2, int(sh * 0.60)), t, fill=STEEL_DARK, font=title_font)
    s = "Spare parts organizer"
    sb = d.textbbox((0, 0), s, font=sub_font)
    d.text((cx - (sb[2] - sb[0]) // 2, int(sh * 0.60) + 200), s, fill=(110, 120, 128), font=sub_font)
    sp.save("splash.png")
    print("saved splash.png")


if __name__ == "__main__":
    make_icon(1024, "icon.png")
    make_icon(96, "favicon.png")
    make_adaptive()
    make_splash()
