# 다크패턴 진단 센터

금융상품 판매 화면에서 나타날 수 있는 다크패턴을 학습하고, 사례 이미지를 보며 대분류를 진단하고, 실제 경험을 공유하는 Next.js 정적 웹사이트입니다.

## 주요 기능

- 가이드라인: 15개 다크패턴 세부 유형을 대분류별로 탐색
- 진단 테스트: 15개 사례 중 무작위 10개를 풀고 정확도 저장
- 경험 공유: 다크패턴 경험을 간단히 작성하고 최근 공유글 조회
- Firebase 연동: Realtime Database에 진단 결과와 커뮤니티 글 저장

## 실행

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 `http://localhost:3000`에서 열립니다.

## 배포

```bash
npm run build
firebase deploy --only hosting,database
```

`next.config.ts`의 `output: "export"` 설정으로 `out/` 폴더를 만들고 Firebase Hosting에 배포합니다. 커뮤니티 기능을 위해 Realtime Database rules도 함께 배포해야 합니다.

## 구조

```text
app/
  page.tsx             # 홈
  guidelines/page.tsx  # 다크패턴 가이드라인
  diagnostic/page.tsx  # 랜덤 10문항 진단 테스트
  community/page.tsx   # 경험 공유 커뮤니티
lib/
  diagnosticData.ts    # 문항 및 분류 데이터
  firebase.ts          # Firebase 클라이언트 설정
  shuffle.ts           # 랜덤 셔플 유틸
```
