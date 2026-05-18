export interface DiagnosticQuestion {
  id: string;
  image: string;
  question: string;
  description: string;
  category: string;
  type: 'odo' | 'bang' | 'ab' | 'pyeo';
}

export interface DarkPatternCategory {
  type: 'odo' | 'bang' | 'ab' | 'pyeo';
  title: string;
  description: string;
  color: string;
  icon: string;
  badge: string;
}

export const categories: Record<string, DarkPatternCategory> = {
  odo: {
    type: 'odo',
    title: '오도형',
    description: '거짓·통상적 기대와 다르게 화면·문장 등을 구성해 소비자의 착각·실수를 유도',
    color: '#E6F1FB',
    icon: '🙈',
    badge: '5문항',
  },
  bang: {
    type: 'bang',
    title: '방해형',
    description: '의사결정에 필요한 정보 수집에 과도한 시간·노력이 들게 만들어 합리적 선택을 포기하도록 유도',
    color: '#FAECE7',
    icon: '🚧',
    badge: '4문항',
  },
  ab: {
    type: 'ab',
    title: '압박형',
    description: '금융소비자에게 심리적 압박을 가해 특정 행위를 하거나 하지 않도록 유도',
    color: '#FAEEDA',
    icon: '⚠️',
    badge: '5문항',
  },
  pyeo: {
    type: 'pyeo',
    title: '편취유도형',
    description: '소비자가 알아채기 어려운 인터페이스 조작으로 비합리적 지출을 유도',
    color: '#EAF3DE',
    icon: '🎯',
    badge: '1문항',
  },
};

export const questions: DiagnosticQuestion[] = [
  // 오도형 (5개) — 이미지·세부유형 매핑
  {
    id: 'q1',
    image: '/images/dark-pattern-01.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 설명절차 과도한 축약 — 약관 전문 없이 제목만 표시, 중요 고지를 작은 글씨로 처리하는 경우',
    category: '설명절차 과도한 축약',
    type: 'odo',
  },
  {
    id: 'q2',
    image: '/images/dark-pattern-02.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 속임수 질문 — "마케팅 수신 거부를 원하지 않습니다" 등 이중부정·모호한 표현',
    category: '속임수 질문',
    type: 'odo',
  },
  {
    id: 'q3',
    image: '/images/dark-pattern-03.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 잘못된 계층구조 — 가입하기는 크고 선명하게, 거절하기는 흐리게 표시하는 경우',
    category: '잘못된 계층구조',
    type: 'odo',
  },
  {
    id: 'q4',
    image: '/images/dark-pattern-04.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 특정옵션 사전선택 — 자동갱신, 부가서비스, 마케팅 동의가 미리 체크된 상태',
    category: '특정옵션 사전선택',
    type: 'odo',
  },
  {
    id: 'q5',
    image: '/images/dark-pattern-05.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 허위광고 및 기만 — 후기인 척 위장된 홍보, 광고 표시 없는 금융상품 추천 등',
    category: '허위광고 및 기만',
    type: 'odo',
  },
  // 방해형 (4개)
  {
    id: 'q6',
    image: '/images/dark-pattern-06.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 취소·탈퇴 방해 — 콜센터 방문만 허용, 여러 단계 확인 강요, 앱 내 해지 불가 등',
    category: '취소·탈퇴 방해',
    type: 'bang',
  },
  {
    id: 'q7',
    image: '/images/dark-pattern-07.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 숨겨진 정보 — 약관 조건 제목만 노출·본문 숨김, 위험고지가 과다한 정보 속에 묻히는 경우',
    category: '숨겨진 정보',
    type: 'bang',
  },
  {
    id: 'q8',
    image: '/images/dark-pattern-08.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 가격비교 방해 — 단위 혼용, 수수료를 작은 단위로 표시, 총 결제액 미공개 등',
    category: '가격비교 방해',
    type: 'bang',
  },
  {
    id: 'q9',
    image: '/images/dark-pattern-09.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 클릭 피로감 — 마이데이터 동의 철회 등에 여러 단계·반복 클릭이 필요한 경우',
    category: '클릭 피로감',
    type: 'bang',
  },
  // 압박형 (5개)
  {
    id: 'q10',
    image: '/images/dark-pattern-10.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 계약과정 중 기습광고 — 대출 신청 화면 중간에 보험 팝업, 충동가입 유도 등',
    category: '계약과정 중 기습광고',
    type: 'ab',
  },
  {
    id: 'q11',
    image: '/images/dark-pattern-11.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 반복간섭 — 푸시·마케팅 동의 팝업이 앱 실행마다 반복 표시되는 경우',
    category: '반복간섭',
    type: 'ab',
  },
  {
    id: 'q12',
    image: '/images/dark-pattern-12.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 감정적 언어사용 — "아니요, 저는 손해를 감수하겠습니다" 등 심리적 압박 문구',
    category: '감정적 언어사용',
    type: 'ab',
  },
  {
    id: 'q13',
    image: '/images/dark-pattern-13.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 감각조작 — 가입 버튼 강조색, 취소 버튼 회색 처리, 투자손실 공포 조작 등',
    category: '감각조작',
    type: 'ab',
  },
  {
    id: 'q14',
    image: '/images/dark-pattern-14.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 다른 소비자 활동 알림 — "방금 OO명이 가입했습니다" 등 사실 여부가 불명확한 표시',
    category: '다른 소비자 활동 알림',
    type: 'ab',
  },
  // 편취유도형 (1개)
  {
    id: 'q15',
    image: '/images/dark-pattern-15.png',
    question:
      '아래 사례 화면은 네 가지 대분류(오도형·방해형·압박형·편취유도형) 중 어디에 가장 잘 해당한다고 보시나요?',
    description:
      '참고 세부 유형: 순차공개 가격책정 — 초기 가격만 표시 후 수수료·환매료 추후 고지, 소단위 표시 등',
    category: '순차공개 가격책정',
    type: 'pyeo',
  },
];
