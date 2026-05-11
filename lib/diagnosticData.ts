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
    badge: '5개',
  },
  bang: {
    type: 'bang',
    title: '방해형',
    description: '의사결정에 필요한 정보 수집에 과도한 시간·노력이 들게 만들어 합리적 선택을 포기하도록 유도',
    color: '#FAECE7',
    icon: '🚧',
    badge: '4개',
  },
  ab: {
    type: 'ab',
    title: '압박형',
    description: '금융소비자에게 심리적 압박을 가해 특정 행위를 하거나 하지 않도록 유도',
    color: '#FAEEDA',
    icon: '⚠️',
    badge: '5개',
  },
  pyeo: {
    type: 'pyeo',
    title: '편취유도형',
    description: '소비자가 알아채기 어려운 인터페이스 조작으로 비합리적 지출을 유도',
    color: '#EAF3DE',
    icon: '🎯',
    badge: '1개',
  },
};

export const questions: DiagnosticQuestion[] = [
  // 오도형 (5개)
  {
    id: 'q1',
    image: '/images/dark-pattern-01.png',
    question: '상품의 핵심 정보가 지나치게 축약되거나 생략되었나요?',
    description: '약관 전문 없이 제목만 표시, 중요 고지를 작은 글씨로 처리하는 경우',
    category: '설명절차의 과도한 축약',
    type: 'odo',
  },
  {
    id: 'q2',
    image: '/images/dark-pattern-02.png',
    question: '모호하거나 이중부정 등 혼란스러운 언어가 사용되었나요?',
    description: '"마케팅 수신 거부를 원하지 않습니다" 등 이중부정 표현',
    category: '속임수 질문',
    type: 'odo',
  },
  {
    id: 'q3',
    image: '/images/dark-pattern-03.png',
    question: '버튼의 크기, 색상이 선택을 강압하고 있나요?',
    description: '가입하기는 크고 선명하게, 거절하기는 흐리게 표시하는 경우',
    category: '잘못된 계층구조',
    type: 'odo',
  },
  {
    id: 'q4',
    image: '/images/dark-pattern-04.png',
    question: '사용자에게 불리한 기본값이 사전 선택되어 있나요?',
    description: '자동갱신, 부가서비스, 마케팅 동의가 미리 체크된 상태',
    category: '특정옵션의 사전선택',
    type: 'odo',
  },
  {
    id: 'q5',
    image: '/images/dark-pattern-05.png',
    question: '광고가 리뷰나 중립적 추천으로 위장되어 있나요?',
    description: '후기인 척 위장된 홍보글, 광고 표시 없는 금융상품 추천',
    category: '허위광고 및 기만적 유인',
    type: 'odo',
  },
  // 방해형 (4개)
  {
    id: 'q6',
    image: '/images/dark-pattern-06.png',
    question: '해지·탈퇴의 절차가 가입보다 훨씬 복잡한가요?',
    description: '콜센터 방문만 허용, 여러 단계 확인 강요, 앱 내에서 해결 불가',
    category: '취소·탈퇴 등의 방해',
    type: 'bang',
  },
  {
    id: 'q7',
    image: '/images/dark-pattern-07.png',
    question: '중요한 정보나 제한사항이 숨겨져 있거나 찾기 어려운가요?',
    description: '약관 조건 제목만 노출, 본문 숨김, 위험고지를 과다한 정보 속에 매몰',
    category: '숨겨진 정보',
    type: 'bang',
  },
  {
    id: 'q8',
    image: '/images/dark-pattern-08.png',
    question: '상품 가격을 쉽게 비교할 수 없도록 되어 있나요?',
    description: '단위 혼용, 수수료를 작은 단위로 표시, 총 결제액 미공개',
    category: '가격비교 방해',
    type: 'bang',
  },
  {
    id: 'q9',
    image: '/images/dark-pattern-09.png',
    question: '원하는 선택을 위해 너무 많은 클릭이 필요한가요?',
    description: '마이데이터 동의 철회 시 여러 단계 반복 클릭 요구',
    category: '클릭 피로감 유발',
    type: 'bang',
  },
  // 압박형 (5개)
  {
    id: 'q10',
    image: '/images/dark-pattern-10.png',
    question: '계약 과정 중 원치 않는 광고·상품이 반복적으로 나타나나요?',
    description: '대출 신청 화면 중간에 보험 팝업, 충동가입 유도',
    category: '계약과정 중 기습적 광고',
    type: 'ab',
  },
  {
    id: 'q11',
    image: '/images/dark-pattern-11.png',
    question: '영구 거부 불가능한 요청이 반복적으로 나타나나요?',
    description: '푸시 알림, 마케팅 동의 팝업이 앱 실행마다 반복 표시',
    category: '반복간섭 (나깅)',
    type: 'ab',
  },
  {
    id: 'q12',
    image: '/images/dark-pattern-12.png',
    question: '수치심이나 심리적 압박을 주는 언어가 사용되나요?',
    description: '"아니요, 저는 손해를 감수하겠습니다", "현명한 투자자라면"',
    category: '감정적 언어사용',
    type: 'ab',
  },
  {
    id: 'q13',
    image: '/images/dark-pattern-13.png',
    question: '색상, 크기, 위치 등 시각 요소로 특정 선택을 강요하나요?',
    description: '가입 버튼 강조색, 취소 버튼 회색 처리, 투자손실 공포 조작',
    category: '감각조작',
    type: 'ab',
  },
  {
    id: 'q14',
    image: '/images/dark-pattern-14.png',
    question: '다른 사람의 구매 활동이 과장되어 표시되나요?',
    description: '"방금 OO명이 이 상품에 가입했습니다" (사실 여부 불명)',
    category: '다른 소비자 활동 알림',
    type: 'ab',
  },
  // 편취유도형 (1개)
  {
    id: 'q15',
    image: '/images/dark-pattern-15.png',
    question: '구매 과정 후반부에 숨겨진 비용이 갑자기 추가되나요?',
    description: '초기 가격만 표시 후 수수료, 환매료 추후 고지, 소단위 표시',
    category: '순차공개 가격책정',
    type: 'pyeo',
  },
];
