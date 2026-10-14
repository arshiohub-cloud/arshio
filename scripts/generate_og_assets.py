import os
from PIL import Image, ImageDraw, ImageFont

def get_white_monogram():
    orig = Image.open('public/arshio-logo-original.png')
    content = orig.crop((230, 192, 817, 367))
    monogram = content.crop((0, 0, 203, content.height))
    bbox = monogram.getbbox()
    cropped = monogram.crop(bbox).convert('RGBA')
    
    w, h = cropped.size
    white_mono = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    for y in range(h):
        for x in range(w):
            r, g, b, a = cropped.getpixel((x, y))
            if a > 0:
                if g > 140 and b > 140 and r < 100:
                    white_mono.putpixel((x, y), (39, 226, 196, a))
                else:
                    white_mono.putpixel((x, y), (255, 255, 255, a))
    return white_mono

def generate_og_image():
    W, H = 1200, 630
    mono = get_white_monogram()

    # 1. Base Dark Canvas
    canvas = Image.new('RGBA', (W, H), (7, 13, 30, 255)) # #070D1E

    # 2. Ambient Glows
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    dglow = ImageDraw.Draw(glow)

    # Teal glow around card on right
    cx1, cy1, r1 = 960, 280, 420
    for r in range(r1, 0, -6):
        alpha = int(45 * (1.0 - (r / r1)**1.8))
        dglow.ellipse([(cx1 - r, cy1 - r), (cx1 + r, cy1 + r)], fill=(39, 226, 196, alpha))

    # Cyan glow at bottom left
    cx2, cy2, r2 = 240, 520, 380
    for r in range(r2, 0, -6):
        alpha = int(35 * (1.0 - (r / r2)**1.8))
        dglow.ellipse([(cx2 - r, cy2 - r), (cx2 + r, cy2 + r)], fill=(34, 184, 240, alpha))

    canvas = Image.alpha_composite(canvas, glow)

    # 3. Modern Grid Pattern
    grid = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    dgrid = ImageDraw.Draw(grid)
    for x in range(0, W, 60):
        dgrid.line([(x, 0), (x, H)], fill=(255, 255, 255, 10), width=1)
    for y in range(0, H, 60):
        dgrid.line([(0, y), (W, y)], fill=(255, 255, 255, 10), width=1)
    canvas = Image.alpha_composite(canvas, grid)

    # 4. Fonts
    font_brand = ImageFont.truetype('segoeuib.ttf', 32)
    font_badge = ImageFont.truetype('segoeuib.ttf', 12)
    font_h1 = ImageFont.truetype('segoeuib.ttf', 38)
    font_sub = ImageFont.truetype('segoeui.ttf', 16)
    font_stat_val = ImageFont.truetype('segoeuib.ttf', 22)
    font_stat_lbl = ImageFont.truetype('segoeui.ttf', 12)
    font_card_head = ImageFont.truetype('segoeuib.ttf', 20)
    font_card_sub = ImageFont.truetype('segoeui.ttf', 13)
    font_pill = ImageFont.truetype('segoeuib.ttf', 13)

    d = ImageDraw.Draw(canvas)

    # Safe Left Margin: 80px
    margin_x = 80

    # 5. Top Brand Bar: Logo + Name + NEXT-GEN Pill Badge
    mono_h = 36
    mono_w = int(mono_h * (mono.width / mono.height))
    scaled_mono = mono.resize((mono_w, mono_h), Image.Resampling.LANCZOS)
    canvas.paste(scaled_mono, (margin_x, 65), scaled_mono)

    d.text((margin_x + mono_w + 14, 65), 'ARSHIO', fill=(255, 255, 255, 255), font=font_brand)

    # Exact Hero Badge: "● NEXT-GEN TECH & CREATIVE STUDIO"
    badge_text = '●  NEXT-GEN TECH & CREATIVE STUDIO'
    badge_bbox = d.textbbox((0, 0), badge_text, font=font_badge)
    bw = badge_bbox[2] - badge_bbox[0] + 24
    bh = 28
    bx = margin_x + mono_w + 14 + 155
    by = 70
    d.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=14, fill=(11, 28, 48, 255), outline=(39, 226, 196, 180), width=1)
    d.text((bx + 12, by + 5), badge_text, fill=(39, 226, 196, 255), font=font_badge)

    # 6. EXACT HERO HEADLINE (Clean 2 lines)
    d.text((margin_x, 155), 'One Dedicated Studio for All Your', fill=(255, 255, 255, 255), font=font_h1)
    d.text((margin_x, 212), 'Tech & Marketing Needs.', fill=(39, 226, 196, 255), font=font_h1)

    # 7. EXACT HERO SUBTITLE (Clean 2 lines)
    d.text((margin_x, 285), 'Transforming ideas into high-performing web platforms, intuitive user interfaces,', fill=(210, 225, 245, 240), font=font_sub)
    d.text((margin_x, 314), 'and scalable marketing funnels. Fast sprints, senior execution, guaranteed momentum.', fill=(160, 185, 215, 220), font=font_sub)

    # 8. Bottom Stats Cards (Clean 4 cards)
    stats = [
        ('$14M+', 'GMV Driven'),
        ('50+', 'Projects Shipped'),
        ('4.9 / 5', 'Client Rating'),
        ('100%', 'IP Ownership')
    ]

    sx = margin_x
    sy = 450
    sw = 135
    sh = 76
    for val, lbl in stats:
        d.rounded_rectangle([(sx, sy), (sx + sw, sy + sh)], radius=14, fill=(11, 20, 42, 220), outline=(255, 255, 255, 30), width=1)
        d.text((sx + 14, sy + 13), val, fill=(39, 226, 196, 255), font=font_stat_val)
        d.text((sx + 14, sy + 44), lbl, fill=(160, 180, 205, 200), font=font_stat_lbl)
        sx += sw + 16

    # 9. Right Side Visual Showcase Card (Glassmorphism Card)
    card_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    dcard = ImageDraw.Draw(card_layer)
    cx, cy, cw, ch = 780, 88, 345, 465

    # Glass card background with border
    dcard.rounded_rectangle([(cx, cy), (cx + cw, cy + ch)], radius=24, fill=(11, 22, 46, 235), outline=(39, 226, 196, 110), width=2)

    # Centered Glowing Monogram in card
    c_mono_h = 145
    c_mono_w = int(c_mono_h * (mono.width / mono.height))
    c_scaled_mono = mono.resize((c_mono_w, c_mono_h), Image.Resampling.LANCZOS)
    card_layer.paste(c_scaled_mono, (cx + (cw - c_mono_w)//2, cy + 38), c_scaled_mono)

    # Card text
    dcard.text((cx + 34, cy + 210), 'Built for Scale & Impact', fill=(255, 255, 255, 255), font=font_card_head)
    dcard.text((cx + 34, cy + 245), 'Senior engineers. Zero lock-in.', fill=(160, 185, 210, 220), font=font_card_sub)

    # 3 Feature Pills
    pills = [
        '•  Dedicated Senior Talent',
        '•  Weekly Working Builds',
        '•  Fixed Transparent Scope'
    ]
    py = cy + 292
    for p in pills:
        dcard.rounded_rectangle([(cx + 28, py), (cx + cw - 28, py + 38)], radius=10, fill=(39, 226, 196, 25), outline=(39, 226, 196, 70), width=1)
        dcard.text((cx + 40, py + 10), p, fill=(240, 255, 252, 245), font=font_pill)
        py += 46

    canvas = Image.alpha_composite(canvas, card_layer)

    # Border around entire OG image
    d_final = ImageDraw.Draw(canvas)
    d_final.rectangle([(0, 0), (W-1, H-1)], outline=(39, 226, 196, 80), width=2)

    canvas.convert('RGB').save('public/og-image.png', 'PNG', quality=95)
    print('Generated updated public/og-image.png successfully!')

if __name__ == '__main__':
    generate_og_image()
