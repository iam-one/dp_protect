import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          다크패턴 진단 센터
        </h1>
        <p className="text-xl text-gray-700 mb-4">
          웹사이트의 다크패턴을 진단하고 예방하세요
        </p>
        <p className="text-gray-600 mb-12">
          사용자 경험을 해치는 악의적인 디자인 패턴들을 식별하고
          건강한 UX를 위한 가이드라인을 제공합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/guidelines">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                가이드라인
              </h2>
              <p className="text-gray-600">
                다크패턴의 유형과 예방법을 알아보세요
              </p>
            </div>
          </Link>

          <Link href="/diagnostic">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                진단 테스트
              </h2>
              <p className="text-gray-600">
                실제 사례로 다크패턴을 진단해보세요
              </p>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🚨 다크패턴이란?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            다크패턴은 사용자를 속이거나 조작하여 원치 않는 결정을 하도록
            만드는 사기성 UI/UX 디자인 기법입니다.
            숨겨진 옵션, 혼동스러운 언어, 강압적인 시간 제한 등이 포함됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
