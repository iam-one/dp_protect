'use client';

import Link from 'next/link';
import { useState } from 'react';
import { categories } from '@/lib/diagnosticData';

interface Guideline {
  id: string;
  title: string;
  description: string;
  examples: string[];
  prevention: string[];
  icon: string;
  type: 'odo' | 'bang' | 'ab' | 'pyeo';
}

const guidelines: Guideline[] = [
  {
    id: 'g1',
    title: '① 설명절차의 과도한 축약',
    description:
      '상품의 위험·조건 등 핵심 정보를 지나치게 압축하거나 생략해 소비자가 내용을 이해하지 못한 채 가입하게 유도',
    examples: [
      '약관 전문 없이 제목만 표시',
      '중요 고지를 작은 글씨로 처리',
      '핵심 조건을 축약 표현',
    ],
    prevention: [
      '모든 중요 정보를 명확한 크기로 표시',
      '약관 전문 제공',
      '위험요소를 별도 섹션으로 강조',
    ],
    icon: '🙈',
    type: 'odo',
  },
  {
    id: 'g2',
    title: '② 속임수 질문',
    description:
      '모호하거나 혼란스러운 언어(이중부정 등)를 사용해 소비자가 원치 않는 방향으로 선택을 유도',
    examples: [
      '"마케팅 수신 거부를 원하지 않습니다" 이중부정 표현',
      '모호한 질문으로 혼동 유도',
      '이해하기 어려운 표현 사용',
    ],
    prevention: [
      '긍정 문장으로 명확히 표현 ("동의합니다" vs "거부하지 않습니다")',
      '선택지를 대칭적으로 제시',
      '쉬운 언어 사용',
    ],
    icon: '❓',
    type: 'odo',
  },
  {
    id: 'g3',
    title: '③ 잘못된 계층구조',
    description:
      '시각적으로 눈에 띄는 대비를 사용하여 소비자가 특정 선택을 하도록 유도하는 강압적 설계',
    examples: [
      '가입 버튼은 크고 선명, 거절은 흐리게 표시',
      '색상 대비로 선택 강요',
      '크기 차이로 유도',
    ],
    prevention: [
      '모든 선택지를 동등하게 시각화',
      '일관된 컬러 사용 (긍정/부정 중립적)',
      '버튼 크기와 가독성 통일',
    ],
    icon: '⚖️',
    type: 'odo',
  },
  {
    id: 'g4',
    title: '④ 특정옵션의 사전선택',
    description:
      '기업에는 유리하지만 소비자에게는 불리한 기본값을 미리 선택해 놓아 소비자가 변경하지 않으면 불리한 선택이 자동 적용',
    examples: [
      '자동갱신 기본 체크',
      '부가서비스 미리 선택',
      '마케팅 동의 사전 체크',
    ],
    prevention: [
      '모든 체크박스 기본값은 미체크',
      '소비자 이익 우선 기본값 설정',
      '변경 사항을 명시적으로 요구',
    ],
    icon: '✓️',
    type: 'odo',
  },
  {
    id: 'g5',
    title: '⑤ 허위광고 및 기만적 유인',
    description:
      '편견없는 리뷰나 독립적인 저널리즘처럼 보이도록 광고하거나 중립적 순위목록·비교사이트처럼 위장',
    examples: [
      '후기인 척 위장된 홍보글',
      '광고 표시 없는 상품 추천',
      '광고인 것처럼 보이지 않는 콘텐츠',
    ],
    prevention: [
      '모든 광고에 명확한 표시 ("광고" 레이블)',
      '진정한 사용자 리뷰만 표시',
      '스폰서십 투명히 공개',
    ],
    icon: '📢',
    type: 'odo',
  },
  {
    id: 'g6',
    title: '⑥ 취소·탈퇴 등의 방해 (경로은닉)',
    description:
      '가입은 쉽지만 해지·탈퇴·환불은 어렵게 설계. 취소 메뉴를 찾기 어렵게 숨기거나 절차를 복잡하게 만들어 포기를 유도',
    examples: [
      '해지 신청 시 콜센터·지점 방문만 허용',
      '앱 내에서 해지 불가능',
      '여러 단계의 확인 강요',
    ],
    prevention: [
      '해지 경로를 가입만큼 간단하게',
      '앱 내에서 완료 가능하도록',
      '확인 단계 최소화',
    ],
    icon: '🚧',
    type: 'bang',
  },
  {
    id: 'g7',
    title: '⑦ 숨겨진 정보',
    description:
      '중요한 정보 또는 중요한 제품 제한 사항을 숨김. 금융상품의 핵심 조건을 공개하지 않거나 찾기 어려운 곳에 배치',
    examples: [
      '약관 조건 제목만 노출, 본문 숨김',
      '위험고지를 정보 과잉 속에 매몰',
      '접기/펼치기로 정보 숨김',
    ],
    prevention: [
      '핵심 정보를 먼저 표시',
      '중요 정보를 별도 섹션으로 강조',
      '한눈에 비교 가능하도록 구성',
    ],
    icon: '👁️‍🗨️',
    type: 'bang',
  },
  {
    id: 'g8',
    title: '⑧ 가격비교 방해',
    description:
      '상품을 묶거나 다른 측정방식을 사용하거나, 총 결제횟수 또는 전체 비용을 공개하지 않아 쉽게 비교할 수 없게 함',
    examples: [
      '단위당 가격·대온스당 가격 혼용',
      '수수료를 가상자산 소단위로 표시',
      '총 비용 미공개',
    ],
    prevention: [
      '모든 가격을 동일 단위로 표시',
      '총 비용을 명확히 표시',
      '수수료를 원화 기준으로 표시',
    ],
    icon: '💰',
    type: 'bang',
  },
  {
    id: 'g9',
    title: '⑨ 클릭 피로감 유발',
    description:
      '소비자가 유리한 옵션 선택이나 정보 수집을 위해 많은 클릭(터치)이 필요하도록 만들어 자신에게 유리한 선택을 포기하게 유도',
    examples: [
      '마이데이터 동의 철회 시 여러 단계 반복 클릭 요구',
      '설정 변경을 위한 과다한 단계',
      '정보 접근을 위한 복잡한 절차',
    ],
    prevention: [
      '중요 선택은 최소 3클릭 이내',
      '설정 변경을 간단하게',
      '정보 접근을 직관적으로',
    ],
    icon: '👆',
    type: 'bang',
  },
  {
    id: 'g10',
    title: '⑩ 계약과정 중 기습적 광고',
    description:
      '계약·결제 진행 중 소비자가 원치 않는 광고·추천 상품을 반복적으로 삽입하여 충동가입을 유도',
    examples: [
      '대출 신청 화면 중간에 보험 팝업',
      '결제 직전 부가 상품 강제 제시',
      '계약 완료 직전의 광고 삽입',
    ],
    prevention: [
      '계약 과정 중 광고 최소화',
      '명확한 거절 옵션 제공',
      '추천 상품을 선택적으로 제시',
    ],
    icon: '📰',
    type: 'ab',
  },
  {
    id: 'g11',
    title: '⑪ 반복간섭 (나깅)',
    description:
      '소비자가 영구적으로 거부할 수 없는 요청을 반복하거나, 방해가 되는 방식으로 조치를 취할 것인지 묻는 행위',
    examples: [
      '푸시 알림 허용 팝업이 앱 실행마다 반복',
      '마케팅 동의 요청 반복',
      '영구 거부 옵션 없음',
    ],
    prevention: [
      '한 번 거부하면 다시 묻지 않기',
      '설정에서 변경 가능하도록 제공',
      '합리적인 알림 주기 설정',
    ],
    icon: '🔔',
    type: 'ab',
  },
  {
    id: 'g12',
    title: '⑫ 감정적 언어사용 (수치심 유발)',
    description:
      '수치심을 이용해 대안을 나쁜 결정으로 프레임하거나, "현명한 투자자라면" 같은 문구로 심리적 압박을 주어 특정 선택을 유도',
    examples: [
      '"아니요, 저는 손해를 감수하겠습니다" 거절 문구',
      '"현명한 투자자는"과 같은 심리 조작',
      '수치심을 이용한 선택 강요',
    ],
    prevention: [
      '중립적 거절 문구 ("아니요" 사용)',
      '선택에 대한 가치 판단 금지',
      '객관적 정보만 제공',
    ],
    icon: '😔',
    type: 'ab',
  },
  {
    id: 'g13',
    title: '⑬ 감각조작',
    description:
      '색상·크기·위치·스타일 등 시각적 요소를 사용해 소비자의 주의를 한가지에 집중시키거나 원치 않는 방향으로 분산',
    examples: [
      '가입 버튼 강조색·취소 버튼 회색 처리',
      '투자손실 공포를 이용한 조작',
      '플래시 애니메이션으로 주의 분산',
    ],
    prevention: [
      '모든 선택지를 시각적으로 동등하게',
      '중립적 색상 사용 (행동 유도 아님)',
      '명확한 정보 구분',
    ],
    icon: '🎨',
    type: 'ab',
  },
  {
    id: 'g14',
    title: '⑭ 다른 소비자의 활동 알림',
    description:
      '다른 사람들의 구매·가입 활동을 허위 또는 과장하여 표시함으로써 사회적 증거로 압박',
    examples: [
      '"방금 OO명이 이 상품에 가입했습니다" (사실 여부 불명)',
      '구매 활동 과장 표시',
      '허위 인기도 표시',
    ],
    prevention: [
      '검증된 실제 통계만 사용',
      '실시간 수치가 아닌 경우 명시',
      '사회적 증거 조작 금지',
    ],
    icon: '👥',
    type: 'ab',
  },
  {
    id: 'g15',
    title: '⑮ 순차공개 가격책정 (드립 프라이싱)',
    description:
      '제품 총 가격의 일부만 처음에 광고한 후 구매 프로세스 후반부에 필수요금·수수료를 부과하여 소비자가 최초 제시 가격보다 더 많은 비용을 지불하도록 유도',
    examples: [
      '펀드 가입 화면에 운용보수만 표시 → 결제 직전 판매보수 추가',
      '가상자산 수수료를 소단위(코인)로 표시',
      '배송료를 결제 직전에 추가',
    ],
    prevention: [
      '모든 비용을 처음부터 명시',
      '최종 가격을 결제 전에 확인',
      '숨겨진 비용 없음을 명확히',
    ],
    icon: '💳',
    type: 'pyeo',
  },
];

export default function Guidelines() {
  const [activeTab, setActiveTab] = useState<'all' | 'odo' | 'bang' | 'ab' | 'pyeo'>('all');

  const filteredGuidelines =
    activeTab === 'all' ? guidelines : guidelines.filter((g) => g.type === activeTab);

  const getCategoryColor = (type: 'odo' | 'bang' | 'ab' | 'pyeo') => {
    const cat = categories[type];
    return cat.color;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/">
          <button className="mb-8 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2">
            ← 돌아가기
          </button>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          다크패턴 예방 가이드라인
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          금융위원회 온라인 금융상품 다크패턴 가이드라인 기반 (2025.12)
        </p>

        {/* 탭 버튼 */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-600'
            }`}
          >
            전체 보기 (15개)
          </button>
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'odo' | 'bang' | 'ab' | 'pyeo')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-600'
              }`}
            >
              {cat.title} ({cat.badge})
            </button>
          ))}
        </div>

        {/* 카테고리 요약 */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(categories).map(([key, cat]) => (
              <div key={key} className="bg-white rounded-lg p-4 border-l-4" style={{ borderColor: cat.color.split(';')[0] }}>
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{cat.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{cat.description}</p>
                <p className="text-xs text-gray-500 mt-2 font-semibold">{cat.badge} 세부유형</p>
              </div>
            ))}
          </div>
        )}

        {/* 가이드라인 카드 */}
        <div className="space-y-6">
          {filteredGuidelines.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow border-l-4"
              style={{ borderColor: getCategoryColor(guide.type).split(';')[0] }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span>{guide.icon}</span>
                {guide.title}
              </h2>
              <p className="text-gray-700 text-lg mb-6">{guide.description}</p>

              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    ⚠️ 위험한 사례
                  </h3>
                  <ul className="space-y-2">
                    {guide.examples.map((example, idx) => (
                      <li key={idx} className="text-gray-700 flex gap-2">
                        <span className="text-red-500 font-bold flex-shrink-0">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    ✅ 예방 방법
                  </h3>
                  <ul className="space-y-2">
                    {guide.prevention.map((method, idx) => (
                      <li key={idx} className="text-gray-700 flex gap-2">
                        <span className="text-green-500 font-bold flex-shrink-0">•</span>
                        <span>{method}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 이미지 영역 (나중에 삽입 가능) */}
              <div className="mt-6 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-gray-500 text-sm">
                  📸 사례 이미지 영역 (ID: {guide.id})
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-8 border-l-4 border-blue-500">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 윤리적 디자인 원칙</h3>
          <ul className="space-y-3 text-gray-700">
            <li>✓ 사용자의 의도를 최우선으로 생각하기</li>
            <li>✓ 모든 정보를 명확하고 투명하게 공개하기</li>
            <li>✓ 사용자가 쉽게 변경하고 취소할 수 있도록 하기</li>
            <li>✓ 정직한 언어와 디자인 사용하기</li>
            <li>✓ 조작적 시간 압박이나 거짓 메시지 피하기</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link href="/diagnostic">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
              진단 테스트 시작하기
            </button>
          </Link>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          출처: 금융위원회·금융감독원 「온라인 금융상품 판매 관련 다크패턴 가이드라인」 (2025.12.26)
        </p>
      </div>
    </div>
  );
}
