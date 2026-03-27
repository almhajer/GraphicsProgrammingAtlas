from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "assets" / "pipeline_gifs"
OUT_DIR.mkdir(parents=True, exist_ok=True)

FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


def centered_text(draw: ImageDraw.ImageDraw, center: tuple[float, float], text: str, text_font, fill):
    bbox = draw.textbbox((0, 0), text, font=text_font)
    x = center[0] - (bbox[2] - bbox[0]) / 2
    y = center[1] - (bbox[3] - bbox[1]) / 2
    draw.text((x, y), text, font=text_font, fill=fill)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def mix(c1, c2, t):
    return tuple(int(lerp(a, b, t)) for a, b in zip(c1, c2))


def make_bg(w: int, h: int, top=(7, 16, 29), bottom=(4, 8, 18), horizon=0.66):
    image = Image.new("RGBA", (w, h), top + (255,))
    draw = ImageDraw.Draw(image)
    for y in range(h):
        t = y / max(1, h - 1)
        color = mix(top, bottom, t)
        draw.line((0, y, w, y), fill=color)
    hz = int(h * horizon)
    draw.rectangle((0, 0, w, hz // 2), fill=(14, 26, 52, 54))
    draw.rectangle((0, hz, w, h), fill=(4, 8, 18, 210))
    for x in range(-w // 6, w + w // 6, max(18, w // 24)):
        draw.line((x, h, lerp(w / 2, x, 0.15), hz), fill=(32, 58, 90, 82), width=1)
    for y in range(hz + 10, h + 16, max(12, h // 10)):
        shrink = (y - hz) / max(1, h - hz)
        left = int(w * 0.08 * shrink)
        right = int(w - w * 0.08 * shrink)
        draw.line((left, y, right, y), fill=(28, 52, 82, 72), width=1)
    draw.line((0, hz, w, hz), fill=(24, 48, 79, 140), width=2)
    return image


def add_glow(base: Image.Image, box, color, blur=14, alpha=110):
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle(box, radius=22, fill=color + (alpha,))
    overlay = overlay.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(overlay)


def draw_prism(base: Image.Image, x, y, w, h, depth, front, top, side, active=False):
    draw = ImageDraw.Draw(base)
    shadow = [
        (x + 12, y + h + 8),
        (x + w + depth + 24, y + h + 2),
        (x + w + depth + 40, y + h + depth + 10),
        (x + 26, y + h + depth + 16),
    ]
    draw.polygon(shadow, fill=(0, 0, 0, 56))
    top_face = [(x, y), (x + depth, y - depth), (x + w + depth, y - depth), (x + w, y)]
    side_face = [(x + w, y), (x + w + depth, y - depth), (x + w + depth, y + h - depth), (x + w, y + h)]
    draw.polygon(top_face, fill=top + (255,))
    draw.polygon(side_face, fill=side + (255,))
    draw.rounded_rectangle((x, y, x + w, y + h), radius=16, fill=front + (255,), outline=(255, 255, 255, 34), width=2)
    if active:
        add_glow(base, (x - 10, y - 10, x + w + depth + 10, y + h + 10), top, blur=12, alpha=100)
        draw.rounded_rectangle((x - 4, y - 4, x + w + 4, y + h + 4), radius=18, outline=(255, 224, 102, 230), width=4)


def draw_chip(draw, x, y, text, color):
    text_font = font(16, bold=True)
    bbox = draw.textbbox((0, 0), text, font=text_font)
    width = bbox[2] - bbox[0] + 26
    draw.rounded_rectangle((x, y, x + width, y + 28), radius=14, fill=(18, 35, 58, 232), outline=color + (180,), width=2)
    draw.text((x + 13, y + 5), text, font=text_font, fill=(248, 251, 255))
    return width


def draw_monitor(draw, box, accent, detail):
    x1, y1, x2, y2 = box
    draw.rounded_rectangle(box, radius=10, fill=(20, 34, 58), outline=detail, width=3)
    draw.rounded_rectangle((x1 + 8, y1 + 8, x2 - 8, y2 - 18), radius=8, fill=(12, 19, 34))
    draw.rectangle((x1 + 32, y2 - 14, x2 - 32, y2 - 8), fill=detail)
    draw.rectangle((x1 + 22, y1 + 16, x1 + 46, y1 + 40), fill=accent)
    draw.rectangle((x1 + 52, y1 + 24, x1 + 76, y1 + 48), fill=detail)


def make_gif(frames: list[Image.Image], path: Path, fps: int):
    pal_frames = [frame.convert("P", palette=Image.Palette.ADAPTIVE, colors=255) for frame in frames]
    pal_frames[0].save(
        path,
        save_all=True,
        append_images=pal_frames[1:],
        duration=int(1000 / fps),
        loop=0,
        optimize=False,
        disposal=2,
    )


def hero_frames():
    w, h = 1200, 360
    fps = 12
    count = fps * 6
    title_font = font(30, bold=True)
    sub_font = font(15)
    label_font = font(24, bold=True)
    small_font = font(16)
    stages = [
        {"pill": "READ", "label": "Vertex Input", "front": (33, 135, 134), "top": (86, 217, 214), "side": (16, 92, 95), "icon": "dots"},
        {"pill": "GROUP", "label": "Assembly", "front": (73, 121, 176), "top": (146, 213, 255), "side": (46, 86, 126), "icon": "triangle"},
        {"pill": "MOVE", "label": "Vertex Shader", "front": (92, 99, 182), "top": (181, 190, 255), "side": (64, 72, 149), "icon": "wave"},
        {"pill": "SPLIT", "label": "Rasterizer", "front": (140, 101, 198), "top": (212, 180, 255), "side": (95, 72, 143), "icon": "pixels"},
        {"pill": "SHADE", "label": "Fragment", "front": (181, 122, 79), "top": (243, 188, 140), "side": (133, 88, 55), "icon": "monitor"},
        {"pill": "WRITE", "label": "Color Out", "front": (161, 90, 116), "top": (240, 167, 192), "side": (119, 66, 89), "icon": "bars"},
    ]
    xs = [66, 250, 434, 618, 802, 986]
    frames = []
    for i in range(count):
        t = i / (count - 1)
        base = make_bg(w, h)
        draw = ImageDraw.Draw(base)
        draw.rounded_rectangle((30, 28, 322, 72), radius=16, fill=(18, 39, 65, 186), outline=(97, 176, 255, 86), width=2)
        draw.text((48, 35), "GRAPHICS PIPELINE", font=title_font, fill=(235, 244, 255))
        draw.text((50, 76), "clean 3D flow, no overlapping labels", font=sub_font, fill=(152, 183, 218))
        pulse_x = lerp(74, 1122, t)
        draw.rounded_rectangle((74, 270, 1122, 276), radius=3, fill=(45, 77, 118))
        for idx, x in enumerate(xs):
            stage_active = idx == min(len(xs) - 1, int(t * len(xs)))
            stage = stages[idx]
            draw_prism(base, x, 136, 132, 78, 18, stage["front"], stage["top"], stage["side"], active=stage_active)
            draw_chip(draw, x + 18, 98, stage["pill"], stage["top"])
            centered_text(draw, (x + 66, 227), stage["label"], label_font, (245, 251, 255))
            if stage["icon"] == "dots":
                for dx, dy, c in [(0, 16, (167, 255, 248)), (24, 38, (125, 211, 252)), (48, 22, (103, 232, 249)), (72, 42, (94, 234, 212)), (96, 26, (147, 197, 253))]:
                    draw.rounded_rectangle((x + 18 + dx, 150 + dy, x + 32 + dx, 164 + dy), radius=4, fill=c)
            elif stage["icon"] == "triangle":
                draw.line((x + 36, 188, x + 66, 146, x + 98, 188, x + 36, 188), fill=(235, 246, 255), width=3)
                draw.line((x + 66, 146, x + 66, 198), fill=(146, 213, 255), width=3)
            elif stage["icon"] == "wave":
                draw.line((x + 22, 192, x + 44, 164, x + 66, 178, x + 88, 152, x + 108, 170), fill=(255, 224, 102), width=4)
                draw.line((x + 22, 202, x + 108, 202), fill=(237, 245, 255), width=3)
            elif stage["icon"] == "pixels":
                for px, py in [(28, 154), (48, 174), (66, 160), (86, 176), (106, 162), (36, 190), (58, 198), (96, 194)]:
                    draw.rounded_rectangle((x + px, py, x + px + 10, py + 10), radius=3, fill=(240, 171, 252) if (px + py) % 2 else (233, 213, 255))
            elif stage["icon"] == "monitor":
                draw_monitor(draw, (x + 26, 154, x + 98, 204), (255, 224, 102), (243, 188, 140))
            elif stage["icon"] == "bars":
                draw.rounded_rectangle((x + 28, 160, x + 92, 198), radius=16, fill=(255, 122, 139))
                draw.rounded_rectangle((x + 38, 150, x + 82, 162), radius=6, fill=(255, 209, 220))
        for idx, x in enumerate(xs):
            if idx == min(len(xs) - 1, int(t * len(xs))):
                draw.rounded_rectangle((x - 2, 260, x + 148, 288), radius=12, fill=(249, 220, 90, 36))
        glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        gd.ellipse((pulse_x - 36, 244, pulse_x + 36, 316), fill=(249, 220, 90, 120))
        gd.ellipse((pulse_x - 16, 264, pulse_x + 16, 296), fill=(255, 232, 116))
        glow = glow.filter(ImageFilter.GaussianBlur(10))
        base.alpha_composite(glow)
        draw.rounded_rectangle((pulse_x - 10, 267, pulse_x + 10, 283), radius=8, fill=(255, 232, 116))
        draw.text((744, 297), "data pulse crossing fixed graphics stages", font=small_font, fill=(155, 182, 210))
        frames.append(base)
    return frames, fps


def vertex_input_frames():
    w, h = 360, 180
    fps = 12
    count = fps * 4
    frames = []
    for i in range(count):
        t = i / (count - 1)
        base = make_bg(w, h, horizon=0.62)
        draw = ImageDraw.Draw(base)
        draw_prism(base, 34, 60, 118, 66, 16, (23, 123, 123), (85, 213, 209), (13, 81, 84), active=True)
        draw_prism(base, 226, 52, 92, 72, 14, (30, 76, 129), (79, 155, 244), (16, 48, 89))
        for row in range(3):
            y = 74 + row * 16
            for col in range(4):
                x = 48 + col * 18
                draw.rounded_rectangle((x, y, x + 12, y + 10), radius=3, fill=((167, 255, 248), (125, 211, 252), (255, 224, 102), (103, 232, 249))[col])
        for lane, color in enumerate([(94, 234, 212), (125, 211, 252), (255, 224, 102)]):
            prog = max(0.0, min(1.0, (t - lane * 0.13) / 0.62))
            x2 = 152 + prog * 78
            y = 82 + lane * 18
            draw.rounded_rectangle((152, y, x2, y + 7), radius=3, fill=color)
        bubble_x = 244 + 34 * math.sin(t * math.pi * 2.0)
        for lane, color in enumerate([(94, 234, 212), (125, 211, 252), (255, 224, 102)]):
            draw.rounded_rectangle((bubble_x, 72 + lane * 18, bubble_x + 22, 84 + lane * 18), radius=5, fill=color)
        frames.append(base)
    return frames, fps


def input_assembly_frames():
    w, h = 360, 180
    fps = 12
    count = fps * 4
    frames = []
    points = [(84, 124), (128, 66), (182, 126)]
    for i in range(count):
        t = i / (count - 1)
        base = make_bg(w, h, horizon=0.62)
        draw = ImageDraw.Draw(base)
        draw_prism(base, 52, 56, 154, 78, 16, (44, 98, 166), (150, 214, 255), (28, 66, 113), active=True)
        draw_prism(base, 240, 62, 74, 66, 14, (71, 122, 176), (168, 222, 255), (38, 76, 120))
        grow = min(1.0, t * 1.6)
        for px, py in points:
            draw.ellipse((px - 9, py - 9, px + 9, py + 9), fill=(255, 224, 102))
        if grow > 0.2:
            p1, p2, p3 = points
            mid12 = (lerp(p1[0], p2[0], grow), lerp(p1[1], p2[1], grow))
            mid23 = (lerp(p2[0], p3[0], grow), lerp(p2[1], p3[1], grow))
            mid31 = (lerp(p3[0], p1[0], grow), lerp(p3[1], p1[1], grow))
            draw.line((p1, mid12), fill=(235, 246, 255), width=3)
            draw.line((p2, mid23), fill=(235, 246, 255), width=3)
            draw.line((p3, mid31), fill=(235, 246, 255), width=3)
        if t > 0.45:
            alpha = max(0.0, min(1.0, (t - 0.45) / 0.4))
            tri = [(lerp(104, 248, alpha), lerp(118, 88, alpha)), (lerp(128, 274, alpha), lerp(66, 74, alpha)), (lerp(182, 300, alpha), lerp(126, 110, alpha))]
            draw.polygon(tri, fill=(125, 211, 252, 90), outline=(255, 224, 102))
        frames.append(base)
    return frames, fps


def vertex_shader_frames():
    w, h = 360, 180
    fps = 12
    count = fps * 4
    frames = []
    src = [(70, 126), (102, 76), (136, 128)]
    dst = [(246, 104), (280, 64), (318, 114)]
    for i in range(count):
        t = i / (count - 1)
        base = make_bg(w, h, horizon=0.62)
        draw = ImageDraw.Draw(base)
        draw_prism(base, 34, 58, 110, 72, 16, (46, 90, 172), (160, 188, 255), (30, 61, 130))
        draw_prism(base, 148, 48, 84, 68, 14, (191, 126, 44), (246, 195, 129), (128, 83, 32), active=True)
        draw_prism(base, 236, 50, 96, 72, 14, (165, 95, 48), (255, 191, 144), (114, 69, 34))
        prog = max(0.0, min(1.0, t * 1.3))
        for (sx, sy), (dx, dy) in zip(src, dst):
            x = lerp(sx, dx, prog)
            y = lerp(sy, dy, prog)
            draw.line((sx, sy, x, y), fill=(255, 224, 102), width=3)
            draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill=(255, 224, 102))
        if t > 0.5:
            alpha = max(0.0, min(1.0, (t - 0.5) / 0.45))
            tri = [(lerp(248, 242, alpha), lerp(104, 96, alpha)), (lerp(280, 284, alpha), lerp(64, 56, alpha)), (lerp(318, 322, alpha), lerp(114, 122, alpha))]
            draw.polygon(tri, fill=(249, 115, 22, 90), outline=(255, 224, 102))
        frames.append(base)
    return frames, fps


def rasterization_frames():
    w, h = 360, 180
    fps = 12
    count = fps * 4
    frames = []
    for i in range(count):
        t = i / (count - 1)
        base = make_bg(w, h, horizon=0.62)
        draw = ImageDraw.Draw(base)
        draw_prism(base, 38, 52, 118, 72, 16, (48, 109, 208), (161, 215, 255), (26, 74, 148))
        draw.rounded_rectangle((188, 42, 320, 128), radius=16, fill=(227, 235, 245), outline=(188, 200, 217), width=2)
        for gx in range(204, 318, 24):
            draw.line((gx, 44, gx, 126), fill=(189, 201, 216), width=1)
        for gy in range(58, 126, 18):
            draw.line((190, gy, 318, gy), fill=(189, 201, 216), width=1)
        tri = [(78, 114), (112, 62), (146, 118)]
        draw.polygon(tri, fill=(96, 165, 250, 60), outline=(255, 224, 102))
        if t < 0.5:
            prog = t / 0.5
            mapped = [(lerp(78, 210, prog), lerp(114, 104, prog)), (lerp(112, 244, prog), lerp(62, 66, prog)), (lerp(146, 278, prog), lerp(118, 112, prog))]
            draw.polygon(mapped, fill=(96, 165, 250, 80), outline=(255, 224, 102))
        else:
            mapped = [(210, 104), (244, 66), (278, 112)]
            draw.polygon(mapped, fill=(96, 165, 250, 80), outline=(255, 224, 102))
            cells = [(222, 92), (246, 92), (234, 110), (258, 110), (246, 74)]
            up = (t - 0.5) / 0.5
            visible = max(1, int(len(cells) * up * 1.2))
            for idx, (cx, cy) in enumerate(cells[:visible]):
                color = [(248, 113, 113), (59, 130, 246), (250, 204, 21), (34, 197, 94), (236, 72, 153)][idx]
                draw.rounded_rectangle((cx - 8, cy - 8, cx + 8, cy + 8), radius=3, fill=color)
        frames.append(base)
    return frames, fps


def fragment_shader_frames():
    w, h = 360, 180
    fps = 12
    count = fps * 4
    frames = []
    for i in range(count):
        t = i / (count - 1)
        base = make_bg(w, h, horizon=0.62)
        draw = ImageDraw.Draw(base)
        draw_prism(base, 34, 54, 108, 72, 16, (122, 72, 193), (210, 177, 255), (86, 52, 135))
        draw_prism(base, 148, 46, 88, 70, 14, (122, 72, 193), (210, 177, 255), (86, 52, 135), active=True)
        draw_prism(base, 238, 54, 86, 72, 14, (123, 36, 79), (251, 146, 180), (96, 26, 58))
        inputs = [(62, 76), (86, 98), (108, 82)]
        for px, py in inputs:
            x = lerp(px, 172, min(1.0, t * 1.3))
            y = lerp(py, 82 + (py - 80) * 0.3, min(1.0, t * 1.3))
            draw.rounded_rectangle((x - 8, y - 8, x + 8, y + 8), radius=4, fill=(255, 224, 102))
        if t > 0.4:
            prog = (t - 0.4) / 0.6
            out_x = lerp(200, 270, prog)
            colors = [(255, 224, 102), (244, 114, 182), (34, 197, 94)]
            for idx, color in enumerate(colors):
                draw.rounded_rectangle((out_x + idx * 18, 74 + idx * 18, out_x + idx * 18 + 20, 88 + idx * 18), radius=5, fill=color)
        frames.append(base)
    return frames, fps


def color_output_frames():
    w, h = 360, 180
    fps = 12
    count = fps * 4
    frames = []
    for i in range(count):
        t = i / (count - 1)
        base = make_bg(w, h, horizon=0.62)
        draw = ImageDraw.Draw(base)
        draw_prism(base, 34, 54, 112, 72, 16, (35, 99, 190), (147, 197, 253), (24, 69, 132))
        draw_prism(base, 214, 52, 112, 74, 14, (153, 56, 87), (251, 146, 180), (112, 38, 63), active=True)
        bars = [(56, 74, (59, 130, 246)), (82, 94, (236, 72, 153)), (108, 114, (34, 197, 94))]
        for delay, (bx, by, color) in enumerate(bars):
            prog = max(0.0, min(1.0, (t - delay * 0.16) / 0.7))
            x = lerp(bx, 232 + delay * 6, prog)
            y = lerp(by, 72 + delay * 20, prog)
            draw.rounded_rectangle((x, y, x + 24, y + 16), radius=5, fill=color)
        if t > 0.45:
            alpha = (t - 0.45) / 0.55
            draw.rounded_rectangle((234, 68, 304, 116), radius=14, fill=(255, 128, 146))
            draw.rectangle((240, 74, 298, 80), fill=(255, 220, 228))
            draw.rectangle((240, 86, int(240 + 58 * alpha), 96), fill=(59, 130, 246))
            draw.rectangle((240, 100, int(240 + 46 * alpha), 110), fill=(236, 72, 153))
        frames.append(base)
    return frames, fps


def build():
    jobs = {
        "pipeline_line.gif": hero_frames,
        "stage_vertex_input.gif": vertex_input_frames,
        "stage_input_assembly.gif": input_assembly_frames,
        "stage_vertex_shader.gif": vertex_shader_frames,
        "stage_rasterization.gif": rasterization_frames,
        "stage_fragment_shader.gif": fragment_shader_frames,
        "stage_color_output.gif": color_output_frames,
    }
    for name, fn in jobs.items():
        frames, fps = fn()
        make_gif(frames, OUT_DIR / name, fps)
        print(f"built {name}")


if __name__ == "__main__":
    build()
