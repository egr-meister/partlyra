from PIL import Image, ImageDraw, ImageFont

# Palette
STEEL = (74, 92, 106)
STEEL_DARK = (58, 73, 85)
BEIGE = (233, 227, 215)
CHARCOAL = (43, 47, 51)
TEAL = (62, 142, 132)
AMBER = (212, 154, 42)
LIGHTGRAY = (241, 240, 236)
SLATE = (203, 210, 216)

def rounded(size, radius, color):
    img = Image.new("RGBA", (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0,0,size-1,size-1], radius=radius, fill=color)
    return img, d

def draw_drawer(d, cx, cy, w, h, fill, outline, ow):
    # drawer box (a labeled storage drawer with a handle and a part dot)
    x0, y0 = cx - w//2, cy - h//2
    x1, y1 = cx + w//2, cy + h//2
    r = max(8, w//14)
    d.rounded_rectangle([x0,y0,x1,y1], radius=r, fill=fill, outline=outline, width=ow)
    # horizontal shelf line splitting drawer
    midy = y0 + int(h*0.46)
    d.line([x0+ow, midy, x1-ow, midy], fill=outline, width=max(2, ow//2))
    # drawer handle (small rounded rect) on lower section
    hw = int(w*0.30); hh = max(6, int(h*0.07))
    hx = cx - hw//2; hy = y0 + int(h*0.72)
    d.rounded_rectangle([hx, hy, hx+hw, hy+hh], radius=hh//2, fill=outline)
    return x0,y0,x1,y1,midy

def make_icon(size, fname, bg=STEEL, with_bg=True, pad_factor=0.0):
    img, d = rounded(size, int(size*0.22), bg if with_bg else (0,0,0,0))
    # inner drawer
    w = int(size*0.56); h = int(size*0.50)
    cx = size//2; cy = int(size*0.52)
    draw_drawer(d, cx, cy, w, h, BEIGE, STEEL_DARK, max(3,size//42))
    # part/gear dot (teal) top-left of upper drawer section
    dot_r = max(4, int(size*0.055))
    d.ellipse([cx-int(w*0.30)-dot_r, cy-int(h*0.22)-dot_r,
               cx-int(w*0.30)+dot_r, cy-int(h*0.22)+dot_r], fill=TEAL)
    # label tag / checkmark (amber square with check) top-right
    tw = int(size*0.14)
    tx = cx+int(w*0.16); ty = cy-int(h*0.30)
    d.rounded_rectangle([tx, ty, tx+tw, ty+tw], radius=max(3,tw//5), fill=AMBER)
    # checkmark
    cwd = max(2, size//40)
    d.line([tx+tw*0.22, ty+tw*0.52, tx+tw*0.42, ty+tw*0.72], fill=(255,255,255), width=cwd)
    d.line([tx+tw*0.42, ty+tw*0.72, tx+tw*0.78, ty+tw*0.28], fill=(255,255,255), width=cwd)
    img.save(fname)
    print("saved", fname, size)

# main icon 1024
make_icon(1024, "icon.png")
# adaptive foreground: transparent bg, drawer centered with safe padding
fg = Image.new("RGBA",(1024,1024),(0,0,0,0))
d = ImageDraw.Draw(fg)
w=int(1024*0.46); h=int(1024*0.42); cx=512; cy=512
draw_drawer(d, cx, cy, w, h, BEIGE, STEEL_DARK, 22)
dot_r=int(1024*0.045)
d.ellipse([cx-int(w*0.30)-dot_r, cy-int(h*0.22)-dot_r, cx-int(w*0.30)+dot_r, cy-int(h*0.22)+dot_r], fill=TEAL)
tw=int(1024*0.12); tx=cx+int(w*0.16); ty=cy-int(h*0.30)
d.rounded_rectangle([tx,ty,tx+tw,ty+tw], radius=tw//5, fill=AMBER)
d.line([tx+tw*0.22, ty+tw*0.52, tx+tw*0.42, ty+tw*0.72], fill=(255,255,255), width=20)
d.line([tx+tw*0.42, ty+tw*0.72, tx+tw*0.78, ty+tw*0.28], fill=(255,255,255), width=20)
fg.save("adaptive-icon.png")
print("saved adaptive-icon.png")

# favicon
make_icon(96, "favicon.png")

# splash: 1284x2778 muted steel bg, centered drawer + name
sw, sh = 1284, 2778
sp = Image.new("RGBA",(sw,sh), LIGHTGRAY)
d = ImageDraw.Draw(sp)
cx, cy = sw//2, int(sh*0.42)
w=int(sw*0.42); h=int(sw*0.40)
draw_drawer(d, cx, cy, w, h, BEIGE, STEEL, 12)
dot_r=int(sw*0.030)
d.ellipse([cx-int(w*0.30)-dot_r, cy-int(h*0.22)-dot_r, cx-int(w*0.30)+dot_r, cy-int(h*0.22)+dot_r], fill=TEAL)
tw=int(sw*0.10); tx=cx+int(w*0.16); ty=cy-int(h*0.30)
d.rounded_rectangle([tx,ty,tx+tw,ty+tw], radius=tw//5, fill=AMBER)
d.line([tx+tw*0.22, ty+tw*0.52, tx+tw*0.42, ty+tw*0.72], fill=(255,255,255), width=10)
d.line([tx+tw*0.42, ty+tw*0.72, tx+tw*0.78, ty+tw*0.28], fill=(255,255,255), width=10)

def load_font(sz):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
              "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]:
        try:
            return ImageFont.truetype(p, sz)
        except: pass
    return ImageFont.load_default()

title_font = load_font(150)
sub_font = load_font(64)
t = "Partlyra"
tb = d.textbbox((0,0), t, font=title_font)
d.text((cx-(tb[2]-tb[0])//2, int(sh*0.60)), t, fill=STEEL_DARK, font=title_font)
s = "Spare parts organizer"
sb = d.textbbox((0,0), s, font=sub_font)
d.text((cx-(sb[2]-sb[0])//2, int(sh*0.60)+200), s, fill=(110,120,128), font=sub_font)
sp.save("splash.png")
print("saved splash.png")
