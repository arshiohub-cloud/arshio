import os
from PIL import Image, ImageDraw, ImageFont

def generate_all():
    W, H = 1200, 630
    
    # Load white monogram
    mono = Image.open('public/test-white-mono.png')

    # 1. Base Dark Canvas
    canvas = Image.new('RGBA', (W, H), (5, 10, 24, 255)) # #050A18

    # 2. Ambient Glows
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    dglow = ImageDraw.Draw(glow)

    # Teal glow around card on right
    cx1, cy1, r1 = 920, 260, 390
    for r in range(r1, 0, -6):
        alpha = int(45 * (1.0 - (r / r1)**1.8))
        dglow.ellipse([(cx1 - r, cy1 - r), (cx1 + r, cy1 + r)], fill=(39, 226, 196, alpha))

    # Cyan/Indigo glow at bottom left
    cx2, cy2, r2 = 220, 520, 380
    for r in range(r2, 0, -6):
        alpha = int(32 * (1.0 - (r / r2)**1.8))
        dglow.ellipse([(cx2 - r, cy2 - r), (cx2 + r, cy2 + r)], fill=(34, 184, 240, alpha))

    canvas = Image.alpha_composite(canvas, glow)

    # 3. Subtle Grid Lines
    grid = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    dgrid = ImageDraw.Draw(grid)
    for x in range(0, W, 60):
        dgrid.line([(x, 0), (x, H)], fill=(255, 255, 255, 10), width=1)
    for y in range(0, H, 60):
        dgrid.line([(0, y), (W, y)], fill=(255, 255, 255, 10), width=1)
    canvas = Image.alpha_composite(canvas, grid)

    # 4. Fonts
    font_brand = ImageFont.truetype('segoeuib.ttf', 34)
    font_badge = ImageFont.truetype('segoeuib.ttf', 13)
    font_h1 = ImageFont.truetype('segoeuib.ttf', 44)
    font_sub = ImageFont.truetype('segoeui.ttf', 18)
    font_stat_val = ImageFont.truetype('segoeuib.ttf', 22)
    font_stat_lbl = ImageFont.truetype('segoeui.ttf', 13)
    font_card_head = ImageFont.truetype('segoeuib.ttf', 22)
    font_card_sub = ImageFont.truetype('segoeui.ttf', 14)
    font_pill = ImageFont.truetype('segoeuib.ttf', 14)

    d = ImageDraw.Draw(canvas)

    # 5. Top Brand Bar: Monogram + Name + Badge
    mono_h = 38
    mono_w = int(mono_h * (mono.width / mono.height))
    scaled_mono = mono.resize((mono_w, mono_h), Image.Resampling.LANCZOS)
    canvas.paste(scaled_mono, (80, 65), scaled_mono)

    d.text((80 + mono_w + 14, 65), 'ARSHIO', fill=(255, 255, 255, 255), font=font_brand)

    badge_text = 'DIGITAL PRODUCT AGENCY'
    badge_bbox = d.textbbox((0, 0), badge_text, font=font_badge)
    bw = badge_bbox[2] - badge_bbox[0] + 24
    bh = 28
    bx = 80 + mono_w + 14 + 160
    by = 72
    d.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=14, fill=(11, 25, 45, 255), outline=(39, 226, 196, 180), width=1)
    d.text((bx + 12, by + 5), badge_text, fill=(39, 226, 196, 255), font=font_badge)

    # Main Headline
    d.text((80, 160), 'Design-Led Digital Products', fill=(255, 255, 255, 255), font=font_h1)
    d.text((80, 218), 'That Scale Your Business.', fill=(39, 226, 196, 255), font=font_h1)

    # Subtitle / Capabilities
    d.text((80, 295), 'Custom ERPs & Software   |   High-Performance Web & Mobile Apps', fill=(210, 225, 245, 240), font=font_sub)
    d.text((80, 328), 'UI/UX Design Systems   |   High-Impact Video & Motion Reels', fill=(160, 185, 210, 220), font=font_sub)

    # Bottom Stats (4 balanced cards that fit cleanly before card on right)
    stats = [
        ('$14M+', 'GMV Driven'),
        ('50+', 'Projects Shipped'),
        ('4.9/5', 'Client Rating'),
        ('100%', 'IP Ownership')
    ]

    sx = 80
    sy = 455
    sw = 140
    sh = 76
    for val, lbl in stats:
        d.rounded_rectangle([(sx, sy), (sx + sw, sy + sh)], radius=14, fill=(11, 20, 42, 220), outline=(255, 255, 255, 30), width=1)
        d.text((sx + 14, sy + 13), val, fill=(39, 226, 196, 255), font=font_stat_val)
        d.text((sx + 14, sy + 44), lbl, fill=(160, 180, 205, 200), font=font_stat_lbl)
        sx += sw + 14

    # 6. Right Side Visual Showcase Card (Glassmorphism Card)
    card_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    dcard = ImageDraw.Draw(card_layer)
    cx, cy, cw, ch = 740, 95, 380, 460

    # Glass card background with border
    dcard.rounded_rectangle([(cx, cy), (cx + cw, cy + ch)], radius=24, fill=(11, 22, 46, 235), outline=(39, 226, 196, 110), width=2)

    # Centered Glowing Monogram in card
    c_mono_h = 145
    c_mono_w = int(c_mono_h * (mono.width / mono.height))
    c_scaled_mono = mono.resize((c_mono_w, c_mono_h), Image.Resampling.LANCZOS)
    card_layer.paste(c_scaled_mono, (cx + (cw - c_mono_w)//2, cy + 38), c_scaled_mono)

    # Card text
    dcard.text((cx + 42, cy + 210), 'Built for Scale & Impact', fill=(255, 255, 255, 255), font=font_card_head)
    dcard.text((cx + 42, cy + 245), 'Senior engineers. Zero lock-in.', fill=(160, 185, 210, 220), font=font_card_sub)

    # 3 Feature Pills
    pills = [
        '•  Dedicated Senior Talent',
        '•  Weekly Working Builds',
        '•  Fixed Transparent Scope'
    ]
    py = cy + 290
    for p in pills:
        dcard.rounded_rectangle([(cx + 38, py), (cx + cw - 38, py + 38)], radius=10, fill=(39, 226, 196, 25), outline=(39, 226, 196, 70), width=1)
        dcard.text((cx + 52, py + 10), p, fill=(240, 255, 252, 245), font=font_pill)
        py += 46

    canvas = Image.alpha_composite(canvas, card_layer)

    # Border around entire OG image
    d_final = ImageDraw.Draw(canvas)
    d_final.rectangle([(0, 0), (W-1, H-1)], outline=(39, 226, 196, 80), width=2)

    canvas.convert('RGB').save('public/og-image.png', 'PNG', quality=95)
    print('Generated public/og-image.png successfully!')

if __name__ == '__main__':
    generate_all()
