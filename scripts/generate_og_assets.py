import os
from PIL import Image, ImageDraw, ImageFilter

def get_white_full_logo():
    orig = Image.open('public/arshio-logo-original.png')
    bbox = (230, 192, 817, 367)
    logo = orig.crop(bbox).convert('RGBA')

    w, h = logo.size
    white_logo = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    for y in range(h):
        for x in range(w):
            r, g, b, a = logo.getpixel((x, y))
            if a > 0:
                if g > 140 and b > 140 and r < 100:
                    white_logo.putpixel((x, y), (39, 226, 196, a)) # luminous teal #27E2C4
                else:
                    white_logo.putpixel((x, y), (255, 255, 255, a)) # crisp white
    return white_logo

def generate_clean_og():
    W, H = 1200, 630
    canvas = Image.new('RGBA', (W, H), (7, 13, 30, 255)) # #070D1E

    # Soft, luminous ambient glow in center
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    dglow = ImageDraw.Draw(glow)
    cx, cy = W // 2, H // 2

    # Central soft teal / cyan bloom
    dglow.ellipse([(cx - 320, cy - 220), (cx + 320, cy + 220)], fill=(39, 226, 196, 65))
    dglow.ellipse([(cx - 200, cy - 140), (cx + 200, cy + 140)], fill=(34, 184, 240, 50))
    glow = glow.filter(ImageFilter.GaussianBlur(80))

    canvas = Image.alpha_composite(canvas, glow)

    # Subtle Luxury Grid Pattern
    grid = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    dgrid = ImageDraw.Draw(grid)
    for x in range(0, W, 60):
        dgrid.line([(x, 0), (x, H)], fill=(255, 255, 255, 8), width=1)
    for y in range(0, H, 60):
        dgrid.line([(0, y), (W, y)], fill=(255, 255, 255, 8), width=1)
    canvas = Image.alpha_composite(canvas, grid)

    # Load full original logo (white + teal)
    logo = get_white_full_logo()
    target_w = 520
    target_h = int(target_w * (logo.height / logo.width))
    scaled_logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)

    px = (W - target_w) // 2
    py = (H - target_h) // 2
    canvas.paste(scaled_logo, (px, py), scaled_logo)

    # Subtle border around canvas
    dborder = ImageDraw.Draw(canvas)
    dborder.rectangle([(0, 0), (W-1, H-1)], outline=(39, 226, 196, 60), width=2)

    canvas.convert('RGB').save('public/og-image.png', 'PNG', quality=95)
    print('Generated clean minimal public/og-image.png successfully!')

if __name__ == '__main__':
    generate_clean_og()
