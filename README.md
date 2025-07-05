# KumohBus 버스 도착 정보 어플리케이션

## 프로젝트 정보

- 개발 기간: 2022. 09 - 2022. 12
- 개발 인원: 3명
- 개인 역할: 팀장 - 프론트,백엔드 설계 및 개발

  주요 기여 및 담당 업무
   * 클라이언트
     - 메인화면 UI 구성 (버스 및 정류장 즐겨찾기 리스트 화면)
     - 버스 UI 구성 (버스 리스트, 노선 조회, 실시간 위치 조회 화면)
     - 정류장 UI 구성 (키워드 검색, 도착 예정 버스 조회 화면)
     - 지도 경로 UI 구성 (KakaoMaps)
       
   * 서버
     - Node js API 서버 구축
     - 공공데이터 국토교통부 API 파싱 및 연결
     - KakaoMpas API 지도 생성 및 연결


## 코드 구조
-   `App.js`
-   `src/`
    -   `assets/`
    -   `components/`
    -   `config/`: 설정값이나 외부 API 주소 등
    -   `router/`: 앱 화면 간의 이동 경로를 설정
    -   `screens/`: 각 화면의 전체적인 디자인과 동작
        -   `Bus/`: 버스 노선 관련 화면들
        -   `BusStop/`: 버스 정류장 관련 화면들
        -   `Home/`: 앱의 메인 화면
        -   `Setting/`: 앱의 설정 화면
    -   `styles/`
    -   `utils/`

## 구현

![IMG_1636](https://github.com/user-attachments/assets/8a40bb11-f51a-412d-8589-3dc094439fa8)

![IMG_1640](https://github.com/user-attachments/assets/0de9a44f-c6f0-4153-9717-494492d15742)

![IMG_1644](https://github.com/user-attachments/assets/64f80ceb-33b6-4355-8dd8-6a84b020a90b)
