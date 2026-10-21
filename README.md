# 국가유산 도장깨기

2026 국가유산 방문 캠페인의 방문코스를 GPS 좌표로 지도에 표시합니다.

| 묶음 | 코스 | 출처 | 지도 표시 |
|---|---|---|---|
| 방문코스 1 | 가야 문명·관동 풍류·백제 고도·산사·서원·선사 지질·설화와 자연·**소릿길 1/2**·**왕가의 길 1/2**·천년 정신 (79곳) | [코스 사이트](https://eb.kh.or.kr:8000/) 크롤링 + 여행지도 PDF 번호(01~98) | 둥근 핀, 1구간 진한색·짧은 점선 / 2구간 밝은색·긴 점선 |
| 방문코스 2 | 근대유산·한반도 공룡·천연동굴의 길 (25곳, 만장굴 플러스 거점 포함) | [2026 여행지도 PDF](https://www.kh.or.kr/visit/resource/files/2026_%EA%B5%AD%EA%B0%80%EC%9C%A0%EC%82%B0_%EB%B0%A9%EB%AC%B8%EC%BD%94%EC%8A%A4_%EC%97%AC%ED%96%89%EC%A7%80%EB%8F%84.pdf) + [스탬프 위치 공지](https://www.kh.or.kr/visit/kor/bbsctt/view.do?key=2407110057&bbscttSn=2609180015)(2026-10-08 4차 수정) | 사각 핀(001~024), 점 선 |

기능: 코스별 경로·번호 핀, 위치·문의·스탬프 장소·운영시간·가는 방법, **내 위치(GPS)**(가장 가까운 곳 안내, 가까운 순 정렬), **주변 맛집**(유산 반경 2km, 적으면 5km · OpenStreetMap), 카카오맵 길찾기·네이버 맛집 검색 링크.

## 실행

```bash
python -m http.server 8765 -d heritage-course-map
```
http://localhost:8765 (GPS는 localhost 또는 https에서만 동작)

## 데이터 다시 받기

```bash
cd heritage-course-map
python crawl.py           # 코스 사이트 /assets/files/road_N/*.txt → data/courses.json
curl -sL "https://www.khs.go.kr/cha/SearchKindOpenapiList.do?pageUnit=20000" -o data/khs_all.xml
python geocode.py         # 국가유산청 공식 좌표 매칭 → data/courses_geo.json
python geocode_pdf.py     # data/pdf_courses.json(PDF·공지를 옮겨 적은 표) → data/course2_geo.json
python restaurants.py     # 방문코스 1 주변 음식점(Overpass) → data/restaurants.json (이어받기)
python restaurants2.py    # 방문코스 2 주변 음식점 → data/restaurants2.json
python hours_tour.py      # 방문코스 1 관람시간(관광공사 TourAPI, 키 필요) → data/hours_tour_raw.json
python build_hours1.py    # 원문 → '오늘 운영' 배지 구조 → data/hours1.json
python build_heritage_all.py  # 전국 국가유산 좌표 1.2만 곳 → heritage_all.js (내 위치·화면 안 국가유산)
python build_icons.py     # 홈 화면 아이콘 → icons/
python build_data.py      # → data.js
```

- PDF는 글자 없는 이미지 한 장이라 `data/pdf_courses.json`에 사람이 옮겨 적었습니다. 새 판이 나오면 이 파일을 고칩니다.
- 좌표: 방문코스 1은 국가유산청 오픈API(62곳 이름 일치, 나머지는 `data/manual_coords.json`), 방문코스 2는 스탬프 장소 기준 OSM. 서천 판교·익산 솜리는 대략 위치(지도에 "대략" 표시).
- 맛집은 OSM 기반이라 농촌 지역은 비어 있을 수 있어 카드마다 네이버 지도 검색 링크를 둡니다.
