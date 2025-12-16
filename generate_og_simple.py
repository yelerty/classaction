#!/usr/bin/env python3
"""
간단한 OG 이미지 생성 스크립트
PIL(Pillow) 사용
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_og_image():
    # 1200x630 이미지 생성
    width, height = 1200, 630

    # 그라데이션 배경 생성
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)

    # 그라데이션 (보라색 계열)
    for y in range(height):
        # RGB 값 계산
        ratio = y / height
        r = int(102 + (118 - 102) * ratio)
        g = int(126 + (75 - 126) * ratio)
        b = int(234 + (162 - 234) * ratio)
        draw.rectangle([(0, y), (width, y + 1)], fill=(r, g, b))

    # 텍스트 추가
    try:
        # 한글 폰트 사용 (macOS 기본 폰트)
        title_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 80)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 40)
        stat_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 60)
        label_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 28)
        footer_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 32)
    except:
        print("⚠️  한글 폰트를 찾을 수 없습니다. 기본 폰트를 사용합니다.")
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        stat_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
        footer_font = ImageFont.load_default()

    # 아이콘과 제목
    icon = "⚖️"
    title = "집단소송 정보센터"
    subtitle = "대한민국 집단소송 통합 정보 플랫폼"

    # 텍스트 위치 계산 (중앙 정렬)
    icon_bbox = draw.textbbox((0, 0), icon, font=title_font)
    icon_width = icon_bbox[2] - icon_bbox[0]

    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]

    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]

    # 아이콘
    draw.text(((width - icon_width) // 2, 100), icon, fill='white', font=title_font)

    # 제목
    draw.text(((width - title_width) // 2, 200), title, fill='white', font=title_font)

    # 부제목
    draw.text(((width - subtitle_width) // 2, 300), subtitle, fill='white', font=subtitle_font)

    # 통계 (3개 컬럼)
    stats = [
        ("10+", "진행 소송"),
        ("3천만+", "피해자"),
        ("2조+", "배상 규모")
    ]

    stat_y = 400
    stat_spacing = width // 3

    for i, (number, label) in enumerate(stats):
        x_center = stat_spacing * i + stat_spacing // 2

        num_bbox = draw.textbbox((0, 0), number, font=stat_font)
        num_width = num_bbox[2] - num_bbox[0]

        label_bbox = draw.textbbox((0, 0), label, font=label_font)
        label_width = label_bbox[2] - label_bbox[0]

        draw.text((x_center - num_width // 2, stat_y), number, fill='white', font=stat_font)
        draw.text((x_center - label_width // 2, stat_y + 70), label, fill='white', font=label_font)

    # 푸터
    footer = "zipdansosong.com"
    footer_bbox = draw.textbbox((0, 0), footer, font=footer_font)
    footer_width = footer_bbox[2] - footer_bbox[0]
    draw.text(((width - footer_width) // 2, 560), footer, fill=(230, 230, 230), font=footer_font)

    # 이미지 저장
    output_path = "og-image.png"
    image.save(output_path, 'PNG', quality=95)
    print(f"✅ {output_path} 생성 완료!")
    print(f"   크기: {width}x{height}px")

    return output_path

if __name__ == "__main__":
    try:
        create_og_image()
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        print("\nPillow 설치가 필요합니다:")
        print("  pip3 install Pillow")
