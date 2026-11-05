"""
@file sync_blog.py
@description 네이버 공식 블로그(https://blog.naver.com/5penthe)에서 새로운 글을 탐지하여
오픈더쉐어 관련 포트폴리오(기업/단체 사회공헌, 온앤온, 온팅, 과학교실, 업사이클링 등)만
선별 수집하고, 썸네일 이미지를 다운로드한 뒤 src/data/mockData.ts에 자동 반영하는 스크립트입니다.
"""

import os
import re
import json
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

# 프로젝트 루트 경로
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MOCKDATA_PATH = os.path.join(ROOT_DIR, "src", "data", "mockData.ts")
PORTFOLIO_IMG_DIR = os.path.join(ROOT_DIR, "public", "images", "portfolio")

RSS_URL = "https://rss.blog.naver.com/5penthe.xml"
BLOG_USER = "5penthe"

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.replace("삼奉사", "삼봉사")
    text = text.replace("溫&ON", "ON&ON").replace("溫ting", "ON-ting").replace("(溫)", "")
    text = re.sub(r"[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]", "", text)
    text = re.sub(r"[\ud800-\udfff]", "", text)
    return text.strip()

def extract_log_no(url: str) -> int:
    m = re.search(r"/(\d{10,14})", url)
    return int(m.group(1)) if m else 0

def fetch_post_details(log_no: int):
    url = f"https://m.blog.naver.com/{BLOG_USER}/{log_no}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"
    })
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"Failed to fetch post {log_no}: {e}")
        return None

    og_img = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html)
    og_title = re.search(r'<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']+)["\']', html)
    og_desc = re.search(r'<meta\s+property=["\']og:description["\']\s+content=["\']([^"\']+)["\']', html)

    # 모든 블로그 본문 사진 URL 탐색 (갤러리용)
    photos = re.findall(r'https://postfiles\.pstatic\.net/[^"\'\s)]+|https://blogfiles\.pstatic\.net/[^"\'\s)]+', html)
    gallery = []
    seen = set()
    for p in photos:
        base_p = p.split("?")[0]
        if base_p not in seen:
            seen.add(base_p)
            gallery.append(base_p + "?type=w800")
            if len(gallery) >= 8:
                break

    img_url = og_img.group(1) if og_img else ""
    if img_url and "?type=" not in img_url:
        img_url += "?type=w800"

    return {
        "title": og_title.group(1) if og_title else "",
        "desc": og_desc.group(1) if og_desc else "",
        "imageUrl": img_url,
        "gallery": gallery
    }

def is_open_the_share_portfolio(title: str, category: str, desc: str) -> bool:
    """
    오픈더쉐어 기업/단체 사회공헌 포스트인지 정밀 판별.
    블로그의 단순 센터 소식(취약계층 아동 후원모집, 내부 공지 등)은 제외하고,
    오픈더쉐어의 핵심 사회공헌(온앤온, 온팅, 기업/단체 봉사활동)만 수집합니다.
    """
    # 1. 명확한 제외 카테고리 및 제목
    exclude_categories = ["새소식", "오픈더퓨처소식", "공지사항", "자원봉사모집"]
    if any(ex in category for ex in exclude_categories):
        return False

    exclude_titles = ["신청 안내", "모집 안내", "후원 안내", "정기총회", "이사회", "선정 결과", "지원사업"]
    if any(ex in title for ex in exclude_titles):
        return False

    combined = f"{title} {category} {desc}"
    
    # 2. 필수 매칭 키워드 (오픈더쉐어의 고유 활동)
    core_keywords = [
        "온앤온", "온팅", "사회공헌", "기업봉사", "단체봉사", "임직원 봉사", "원데이메이킹",
        "찾아가는 과학교실", "과학교실", "스페이스 업사이클링", "EM 흙공", "플로깅",
        "키트 만들기", "나눔키트", "큐브연필꽂이", "공룡다이어리", "자개손거울", "하리보필통"
    ]
    
    return any(k in combined for k in core_keywords)

def determine_metadata(title: str, desc: str):
    # OrgType (기업봉사 vs 단체봉사)
    org_type = "단체봉사"
    group_keywords = ["학교", "중학교", "고등학교", "대학교", "RCY", "재단", "공공기관", "센터", "협회"]
    if any(k in title for k in group_keywords):
        org_type = "단체봉사"
    elif any(k in title for k in ["기업", "임직원", "주식회사", "(주)", "회사"]):
        org_type = "기업봉사"

    # Category
    cat = "원데이메이킹"
    if "과학교실" in title or "STEAM" in title:
        cat = "찾아가는 과학교실"
    elif "업사이클링" in title or "공간" in title:
        cat = "스페이스 업사이클링"
    elif "친환경" in title or "플로깅" in title or "EM" in title:
        cat = "친환경 ESG"
    elif "김장" in title or "베이킹" in title or "나눔" in title:
        cat = "지역사회 나눔"

    # Partner name heuristic
    partner = "참여 파트너사"
    m_with = re.search(r"([가-힣A-Za-z0-9·]+(?:전자|학교|대학교|재단|진흥원|회사|본부|지점|병원|그룹|FC|RCY))\s*(?:과|와|과 함께|와 함께)", title)
    if m_with:
        partner = m_with.group(1).strip()
    else:
        # Fallback from title prefix
        parts = title.split(" ")
        if len(parts) >= 2:
            partner = parts[0].strip()

    return org_type, cat, partner

def main():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Checking Naver Blog RSS feed...")
    
    # 1. RSS 피드 조회
    req = urllib.request.Request(RSS_URL, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            xml_data = resp.read()
    except Exception as e:
        print(f"Error fetching RSS: {e}")
        return

    root = ET.fromstring(xml_data)
    items = root.findall(".//item")
    print(f"Found {len(items)} posts in RSS feed.")

    # 2. 기존 mockData.ts에서 logNo 및 최대 ID 확인
    mock_txt = open(MOCKDATA_PATH, "r", encoding="utf-8").read()
    existing_log_nos = set(int(x) for x in re.findall(r"logNo:\s*(\d+)", mock_txt))
    existing_ids = [int(x) for x in re.findall(r"id:\s*(\d+)", mock_txt)]
    max_id = max(existing_ids) if existing_ids else 97

    print(f"Existing portfolio items in mockData: {len(existing_log_nos)} posts (Max ID: {max_id})")

    new_items_added = 0
    new_portfolio_entries = []

    for item in items:
        link = item.findtext("link", "").strip()
        log_no = extract_log_no(link)
        if not log_no or log_no in existing_log_nos:
            continue

        title = item.findtext("title", "").strip()
        category = item.findtext("category", "").strip()
        pub_date_str = item.findtext("pubDate", "").strip()
        desc_rss = item.findtext("description", "").strip()

        # 오픈더쉐어 포트폴리오 적합성 검사
        if not is_open_the_share_portfolio(title, category, desc_rss):
            print(f"Skipping non-portfolio post: [{category}] {title}")
            continue

        print(f"New portfolio post detected: [{log_no}] {title}")
        details = fetch_post_details(log_no)
        if not details or not details["imageUrl"]:
            print(f"Skipping: could not extract image for {log_no}")
            continue

        # 날짜 파싱 (예: 'Tue, 03 Nov 2026 15:31:03 +0900' -> '2026.11.03')
        try:
            # Parse RFC 822 date
            dt = datetime.strptime(pub_date_str[:16], "%a, %d %b %Y")
            period = dt.strftime("%Y.%m.%d")
            year = dt.strftime("%Y")
        except Exception:
            period = datetime.now().strftime("%Y.%m.%d")
            year = datetime.now().strftime("%Y")

        max_id += 1
        local_filename = f"item_{max_id:03d}.jpg"
        local_path = os.path.join(PORTFOLIO_IMG_DIR, local_filename)

        # 썸네일 이미지 다운로드 (네이버 핫링크 차단 방지)
        try:
            img_req = urllib.request.Request(details["imageUrl"], headers={
                "User-Agent": "Mozilla/5.0",
                "Referer": "https://blog.naver.com/"
            })
            with urllib.request.urlopen(img_req, timeout=15) as img_resp:
                img_bytes = img_resp.read()
            with open(local_path, "wb") as f_img:
                f_img.write(img_bytes)
            print(f"Downloaded thumbnail -> {local_filename} ({len(img_bytes)} bytes)")
        except Exception as e:
            print(f"Failed to download image {details['imageUrl']}: {e}")
            continue

        org_type, cat, partner = determine_metadata(title, details["desc"])
        clean_tit = clean_text(title)
        clean_story = clean_text(details["desc"])

        gal_urls = [f"`${{BASE_URL}}images/portfolio/{local_filename}`"]
        for g in details["gallery"]:
            gal_urls.append(json.dumps(g, ensure_ascii=False))

        entry_code = f"""    {{
      id: {max_id},
      logNo: {log_no},
      title: {json.dumps(clean_tit, ensure_ascii=False)},
      category: {json.dumps(cat, ensure_ascii=False)},
      orgType: {json.dumps(org_type, ensure_ascii=False)},
      partner: {json.dumps(clean_text(partner), ensure_ascii=False)},
      period: {json.dumps(period, ensure_ascii=False)},
      year: {json.dumps(year, ensure_ascii=False)},
      participants: 30,
      imageUrl: `${{BASE_URL}}images/portfolio/{local_filename}`,
      galleryUrls: [{', '.join(gal_urls)}],
      tags: [{json.dumps(org_type, ensure_ascii=False)}, {json.dumps(cat, ensure_ascii=False)}, "사회공헌·나눔"],
      story: {json.dumps(clean_story, ensure_ascii=False)},
      blogLink: {json.dumps(f"https://blog.naver.com/{BLOG_USER}/{log_no}", ensure_ascii=False)}
    }},"""

        new_portfolio_entries.append(entry_code)
        new_items_added += 1

    if new_items_added == 0:
        print("No new posts to update. Website is up to date.")
        return

    # mockData.ts 파일에 신규 아이템 주입 (portfolioItems 배열 시작 부분에 삽입)
    print(f"Inserting {new_items_added} new portfolio items into mockData.ts...")
    target_needle = "portfolioItems: ["
    pos = mock_txt.find(target_needle)
    if pos != -1:
        insert_pos = pos + len(target_needle)
        updated_mock = (
            mock_txt[:insert_pos]
            + "\n"
            + "\n".join(new_portfolio_entries)
            + mock_txt[insert_pos:]
        )
        with open(MOCKDATA_PATH, "w", encoding="utf-8") as f:
            f.write(updated_mock)
        print("Successfully updated mockData.ts!")
    else:
        print("Could not find portfolioItems array in mockData.ts!")

if __name__ == "__main__":
    main()
