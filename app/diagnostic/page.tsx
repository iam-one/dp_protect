'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ref, push } from 'firebase/database';
import { database } from '@/lib/firebase';
import { questions } from '@/lib/diagnosticData';

interface Response {
  questionId: string;
  answer: boolean | null;
  category: string;
  type: string;
}

export default function Diagnostic() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setResponses(
      questions.map((q) => ({
        questionId: q.id,
        answer: null,
        category: q.category,
        type: q.type,
      }))
    );
  }, []);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: boolean) => {
    const newResponses = [...responses];
    newResponses[currentIndex].answer = answer;
    setResponses(newResponses);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowNameInput(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userName.trim()) {
      setError('이름을 입력해주세요');
      return;
    }

    if (responses.some((r) => r.answer === null)) {
      setError('모든 질문에 답변해주세요');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const diagnosticsRef = ref(database, 'diagnostics');
      const darkPatternCount = responses.filter((r) => r.answer === true).length;

      const categoryCounts = responses.reduce(
        (acc, r) => {
          if (r.answer === true) {
            acc[r.type] = (acc[r.type] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>
      );

      await push(diagnosticsRef, {
        name: userName,
        timestamp: new Date().toISOString(),
        responses: responses.map((r) => ({
          questionId: r.questionId,
          answer: r.answer,
          category: r.category,
          type: r.type,
        })),
        darkPatternCount,
        categoryCounts,
        totalQuestions: questions.length,
      });

      setSubmitted(true);
    } catch (err) {
      setError('데이터 저장에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    const darkPatternCount = responses.filter((r) => r.answer === true).length;
    const riskLevel =
      darkPatternCount === 0
        ? '낮음'
        : darkPatternCount <= 5
          ? '중간'
          : '높음';
    const riskColor =
      riskLevel === '낮음'
        ? 'bg-green-100 border-green-500'
        : riskLevel === '중간'
          ? 'bg-yellow-100 border-yellow-500'
          : 'bg-red-100 border-red-500';

    const categoryCounts = responses.reduce(
      (acc, r) => {
        if (r.answer === true) {
          acc[r.type] = (acc[r.type] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              진단 완료!
            </h1>
            <p className="text-gray-600 mb-8">
              {userName}님의 다크패턴 진단 결과가 저장되었습니다.
            </p>

            <div className={`rounded-lg border-2 p-6 mb-8 ${riskColor}`}>
              <p className="text-sm text-gray-600 mb-2">위험도 평가</p>
              <p className="text-4xl font-bold text-gray-900">{riskLevel}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">📊 진단 결과 요약</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  총 질문: <strong>{questions.length}개</strong>
                </p>
                <p>
                  다크패턴 의심: <strong>{darkPatternCount}개</strong>
                </p>
                <p>
                  감지 비율: <strong>{((darkPatternCount / questions.length) * 100).toFixed(1)}%</strong>
                </p>
              </div>

              {darkPatternCount > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 font-semibold mb-3">유형별 감지 현황:</p>
                  <div className="space-y-1 text-sm">
                    {Object.entries(categoryCounts).map(([type, count]) => (
                      <p key={type} className="text-gray-700">
                        • {type === 'odo' ? '오도형' : type === 'bang' ? '방해형' : type === 'ab' ? '압박형' : '편취유도형'}: <strong>{count}개</strong>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {darkPatternCount > 0 && (
                <div className="mt-4 p-4 bg-amber-50 rounded border-l-4 border-amber-500">
                  <p className="text-sm text-gray-700">
                    💡 <strong>제안:</strong> 가이드라인 페이지에서 감지된 다크패턴의 세부 내용과 개선 방법을 확인해보세요.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Link href="/" className="flex-1">
                <button className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors">
                  홈으로
                </button>
              </Link>
              <Link href="/guidelines" className="flex-1">
                <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                  가이드라인 보기
                </button>
              </Link>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setResponses(
                    questions.map((q) => ({
                      questionId: q.id,
                      answer: null,
                      category: q.category,
                      type: q.type,
                    }))
                  );
                  setUserName('');
                  setShowNameInput(false);
                  setSubmitted(false);
                }}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
              >
                다시 테스트
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">결과 저장</h2>
          <p className="text-gray-600 mb-6">
            진단 결과를 저장하기 위해 이름을 입력해주세요.
          </p>

          <input
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setError('');
            }}
            placeholder="이름 입력"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex gap-4">
            <button
              onClick={() => setShowNameInput(false)}
              className="flex-1 bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-gray-400 transition-colors"
            >
              돌아가기
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '저장 중...' : '저장 및 완료'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/">
          <button className="mb-8 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2">
            ← 돌아가기
          </button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 진행률 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-900">진행률</h2>
              <span className="text-sm font-semibold text-indigo-600">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 질문 내용 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                {currentQuestion?.type === 'odo'
                  ? '오도형'
                  : currentQuestion?.type === 'bang'
                    ? '방해형'
                    : currentQuestion?.type === 'ab'
                      ? '압박형'
                      : '편취유도형'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              {currentQuestion?.question}
            </h1>

            {/* 이미지 영역 */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-600 mb-3">사례 이미지</p>
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-400 flex flex-col items-center justify-center overflow-hidden min-h-80">
                <img
                  src={currentQuestion?.image}
                  alt={currentQuestion?.question}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="text-center p-6">
                  <p className="text-6xl mb-3">🖼️</p>
                  <p className="text-gray-600 font-semibold text-lg">이미지 미제공</p>
                  <p className="text-sm text-gray-500 mt-2">{currentQuestion?.id}</p>
                </div>
              </div>
            </div>

            {/* 설명 박스 */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
              <p className="text-gray-700">
                <span className="font-bold">설명:</span> {currentQuestion?.description}
              </p>
            </div>
          </div>

          {/* 응답 버튼 */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex-1 bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← 이전
            </button>

            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 bg-red-500 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-red-600 transition-colors shadow-md"
            >
              아니오 (N)
            </button>

            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 bg-yellow-500 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-yellow-600 transition-colors shadow-md"
            >
              예 (Y)
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          💡 각 질문을 신중하게 검토하고 Y/N으로 응답해주세요.
        </div>
      </div>
    </div>
  );
}
