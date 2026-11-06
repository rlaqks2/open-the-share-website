"""
@file sync_blog.py
@description 네이버 공식 블로그(https://blog.naver.com/5penthe)에서 새로운 글을 탐지하여
1) 오픈더쉐어 포트폴리오(나눔 스토리) 자동 수집 및 이미지 다운로드
2) 언론보도(보도자료) 포스트 탐지 및 실제 언론사 원문 기사 URL 추출 후 src/data/mockData.ts에 자동 반영하는 스크립트입니다.
"""

import os
import re
import html
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
    text = html.unescape(html.unescape(text))
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
            raw_html = resp.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"Failed to fetch post {log_no}: {e}")
        return None

    og_img = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', raw_html)
    og_title = re.search(r'<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']+)["\']', raw_html)
    og_desc = re.search(r'<meta\s+property=["\']og:description["\']\s+content=["\']([^"\']+)["\']', raw_html)

    # 모든 블로그 본문 사진 URL 탐색 (갤러리용)
    photos = re.findall(r'https://postfiles\.pstatic\.net/[^"\'\s)]+|https://blogfiles\.pstatic\.net/[^"\'\s)]+', raw_html)
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

def fetch_press_article_details(log_no: int):
    """
    보도자료 포스트에서 실제 언론사 원문 링크 및 언론사명을 추출합니다.
    언론사 링크가 없으면 None을 반환합니다.
    """
    url = f"https://blog.naver.com/PostView.naver?blogId={BLOG_USER}&logNo={log_no}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    })
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            raw_html = resp.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"Failed to fetch press post {log_no}: {e}")
        return None

    # 언론사 원문 링크 탐색 (naver, pstatic, youtube, widget 제외)
    hrefs = re.findall(r'href=["\'](https?://[^"\']+)["\']', raw_html)
    press_link = None
    for h in hrefs:
        if any(ign in h for ign in ["naver.com", "pstatic.net", "w3.org", "schema.org", "daum.net/favicon", "openthefuture.kr", "openthe.kr"]):
            continue
        press_link = h.replace("%29", "").strip()
        break

    if not press_link:
        # plain url text 검색
        plain_urls = re.findall(r'(https?://[a-zA-Z0-9_\-\./]+[a-zA-Z0-9_\-/])', raw_html)
        for u in plain_urls:
            if any(ign in u for ign in ["naver.com", "pstatic.net", "w3.org", "schema.org", "openthe"]):
                continue
            press_link = u.strip()
            break

    if not press_link:
        return None

    # 출처 언론사명 추출
    source = "언론보도"
    m_src = re.search(r'출처\s*:\s*([가-힣A-Za-z0-9]+)', raw_html)
    if m_src:
        source = m_src.group(1).strip()
    else:
        # 도메인 기반 언론사명 매핑
        if "siminilbo" in press_link:
            source = "시민일보"
        elif "bizwnews" in press_link:
            source = "비즈월드"
        elif "chukkyung" in press_link:
            source = "축산경제신문"
        elif "gosiweek" in press_link:
            source = "피앤피뉴스"
        elif "eanews" in press_link:
            source = "얼리어답터뉴스"
        elif "nbntv" in press_link:
            source = "내외경제TV"
        elif "kihoilbo" in press_link:
            source = "기호일보"
        elif "kdpress" in press_link:
            source = "데일리경제"
        elif "ksilbo" in press_link:
            source = "경상일보"
        elif "cstimes" in press_link:
            source = "컨슈머타임스"

    # 본문 첫 단락에서 요약문 추출
    paragraphs = re.findall(r'<p[^>]*class="[^"]*se-text-paragraph[^"]*"[^>]*>([\s\S]*?)</p>', raw_html)
    summary = ""
    for p in paragraphs:
        clean_p = re.sub(r'<[^>]+>', '', p).strip()
        clean_p = clean_text(clean_p)
        if len(clean_p) > 25 and not clean_p.startswith("출처") and not clean_p.startswith("202"):
            clean_p = re.sub(r'^["“”\']|["“”\']$', '', clean_p)
            summary = clean_p
            break

    return {
        "press_link": press_link,
        "source": source,
        "summary": summary
    }

def is_open_the_share_portfolio(title: str, category: str, desc: str) -> bool:
    exclude_categories = ["새소식", "오픈더퓨처소식", "공지사항", "자원봉사모집", "보도자료"]
    if any(ex in category for ex in exclude_categories):
        return False

    exclude_titles = ["신청 안내", "모집 안내", "후원 안내", "정기총회", "이사회", "선정 결과", "지원사업"]
    if any(ex in title for ex in exclude_titles):
        return False

    combined = f"{title} {category} {desc}"
    core_keywords = [
        "온앤온", "온팅", "사회공헌", "기업봉사", "단체봉사", "임직원 봉사", "원데이메이킹",
        "찾아가는 과학교실", "과학교실", "스페이스 업사이클링", "EM 흙공", "플로깅",
        "키트 만들기", "나눔키트", "큐브연필꽂이", "공룡다이어리", "자개손거울", "하리보필통"
    ]
    return any(k in combined for k in core_keywords)

def determine_metadata(title: str, desc: str):
    org_type = "단체봉사"
    group_keywords = ["학교", "중학교", "고등학교", "대학교", "RCY", "재단", "공공기관", "센터", "협회"]
    if any(k in title for k in group_keywords):
        org_type = "단체봉사"
    elif any(k in title for k in ["기업", "임직원", "주식회사", "(주)", "회사", "전자", "생명", "화재", "케미칼", "제약"]):
        org_type = "기업봉사"

    cat = "원데이메이킹"
    if "과학교실" in title or "STEAM" in title:
        cat = "찾아가는 과학교실"
    elif "업사이클링" in title or "공간" in title:
        cat = "스페이스 업사이클링"
    elif "친환경" in title or "플로깅" in title or "EM" in title:
        cat = "친환경 ESG"
    elif "김장" in title or "베이킹" in title or "나눔" in title:
        cat = "지역사회 나눔"

    partner = "OPEN THE SHARE"
    m_org = re.search(
        r"([가-힣A-Za-z0-9·]+(?:전자|생명|화재|화재서비스|케미칼|제약|바이오|메디칼|시스템즈|모빌리티|이노베이션|중학교|고등학교|대학교\s*RCY|대\s*RCY|대학교|학교|재단|진흥원|연구원|공사|공단|협회|복지관|아동센터|병원|그룹|은행|증권))",
        f"{title} {desc}"
    )
    if m_org:
        partner = m_org.group(1).strip()

    return org_type, cat, partner

def sort_mockdata_portfolio_items(mock_txt: str) -> str:
    s_idx = mock_txt.find("  portfolioItems: [")
    if s_idx == -1:
        return mock_txt
    e_idx = mock_txt.find("  ] as PortfolioItem[],", s_idx)
    if e_idx == -1:
        return mock_txt

    header_part = mock_txt[:s_idx + len("  portfolioItems: [")]
    body_part = mock_txt[s_idx + len("  portfolioItems: ["):e_idx]
    footer_part = mock_txt[e_idx:]

    item_blocks = re.findall(r"(\s*\{\s*id:\s*\d+[\s\S]*?\n\s*\})(?:,|\s*$)", body_part)
    if not item_blocks:
        return mock_txt

    def get_period(block: str) -> str:
        m = re.search(r'period:\s*"([^"]+)"', block)
        return m.group(1) if m else "0000.00.00"

    item_blocks_sorted = sorted(item_blocks, key=get_period, reverse=True)
    new_body = ",\n".join(b.rstrip() for b in item_blocks_sorted) + "\n"
    return header_part + "\n" + new_body + footer_part

def main():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Checking Naver Blog RSS feed...")
    
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

    mock_txt = open(MOCKDATA_PATH, "r", encoding="utf-8").read()
    existing_log_nos = set(int(x) for x in re.findall(r"logNo:\s*(\d+)", mock_txt))
    existing_ids = [int(x) for x in re.findall(r"id:\s*(\d+)", mock_txt)]
    max_id = max(existing_ids) if existing_ids else 110

    # 기존 언론보도 링크 확인 (중복 등록 방지)
    existing_press_links = set(re.findall(r'link:\s*"([^"]+)"', mock_txt))

    print(f"Existing portfolio items in mockData: {len(existing_log_nos)} posts (Max ID: {max_id})")

    new_portfolio_entries = []
    new_press_entries = []

    for item in items:
        link = item.findtext("link", "").strip()
        log_no = extract_log_no(link)
        title = item.findtext("title", "").strip()
        category = item.findtext("category", "").strip()
        pub_date_str = item.findtext("pubDate", "").strip()
        desc_rss = item.findtext("description", "").strip()

        # 1. 언론보도(보도자료) 포스트 처리
        if "보도자료" in category or "보도" in category or title.startswith("[보도자료]"):
            print(f"Potential press release post detected: [{log_no}] {title}")
            press_info = fetch_press_article_details(log_no)
            if not press_info or not press_info["press_link"]:
                print(f"-> Skipping: no direct external news article link in blog post {log_no}")
                continue
            if press_info["press_link"] in existing_press_links:
                continue

            # 날짜 파싱
            try:
                dt = datetime.strptime(pub_date_str[:16], "%a, %d %b %Y")
                press_date = dt.strftime("%Y.%m.%d")
            except Exception:
                press_date = datetime.now().strftime("%Y.%m.%d")

            clean_p_title = clean_text(title).replace("[보도자료]", "").strip()
            clean_p_title = re.sub(r'^\d{4}\.\d{2}\.\d{2}\.?\s*', '', clean_p_title)
            cat_name = "원데이메이킹"
            if "과학교실" in clean_p_title or "STEAM" in clean_p_title:
                cat_name = "찾아가는 과학교실"
            elif "흙공" in clean_p_title or "친환경" in clean_p_title or "ESG" in clean_p_title:
                cat_name = "친환경 ESG"
            elif "나눔" in clean_p_title or "김장" in clean_p_title:
                cat_name = "지역사회 나눔"

            press_summary = press_info["summary"] if press_info["summary"] else clean_p_title

            press_entry = f"""    {{
      id: 999,
      title: {json.dumps(clean_p_title, ensure_ascii=False)},
      date: {json.dumps(press_date, ensure_ascii=False)},
      source: {json.dumps(press_info['source'], ensure_ascii=False)},
      category: {json.dumps(cat_name, ensure_ascii=False)},
      summary: {json.dumps(press_summary, ensure_ascii=False)},
      link: {json.dumps(press_info['press_link'], ensure_ascii=False)}
    }},"""
            new_press_entries.append(press_entry)
            existing_press_links.add(press_info["press_link"])
            print(f"-> Added new press release item: {clean_p_title} ({press_info['press_link']})")
            continue

        # 2. 나눔 포트폴리오 포스트 처리
        if not log_no or log_no in existing_log_nos:
            continue

        if not is_open_the_share_portfolio(title, category, desc_rss):
            continue

        print(f"New portfolio post detected: [{log_no}] {title}")
        details = fetch_post_details(log_no)
        if not details or not details["imageUrl"]:
            print(f"Skipping: could not extract image for {log_no}")
            continue

        try:
            dt = datetime.strptime(pub_date_str[:16], "%a, %d %b %Y")
            period = dt.strftime("%Y.%m.%d")
            year = dt.strftime("%Y")
        except Exception:
            period = datetime.now().strftime("%Y.%m.%d")
            year = datetime.now().strftime("%Y")

        max_id += 1
        local_filename = f"item_{max_id:03d}.jpg"
        local_path = os.path.join(PORTFOLIO_IMG_DIR, local_filename)

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

        clean_tit = clean_text(title)
        clean_story = clean_text(details["desc"])
        org_type, cat, partner = determine_metadata(clean_tit, clean_story)

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

    has_changes = False
    updated_mock = mock_txt

    # 포트폴리오 삽입
    if new_portfolio_entries:
        target_needle = "portfolioItems: ["
        pos = updated_mock.find(target_needle)
        if pos != -1:
            insert_pos = pos + len(target_needle)
            updated_mock = (
                updated_mock[:insert_pos]
                + "\n"
                + "\n".join(new_portfolio_entries)
                + updated_mock[insert_pos:]
            )
            updated_mock = sort_mockdata_portfolio_items(updated_mock)
            has_changes = True

    # 언론보도 삽입
    if new_press_entries:
        target_press_needle = "pressReleases: ["
        pos_press = updated_mock.find(target_press_needle)
        if pos_press != -1:
            insert_pos_press = pos_press + len(target_press_needle)
            updated_mock = (
                updated_mock[:insert_pos_press]
                + "\n"
                + "\n".join(new_press_entries)
                + updated_mock[insert_pos_press:]
            )
            # Re-index ids
            has_changes = True

    if has_changes:
        with open(MOCKDATA_PATH, "w", encoding="utf-8") as f:
            f.write(updated_mock)
        print("Successfully updated mockData.ts with new blog and press releases!")
    else:
        print("No new posts or press releases to update. Website is up to date.")

if __name__ == "__main__":
    main()
