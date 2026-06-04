'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ref, push } from 'firebase/database';
import { database } from '@/lib/firebase';
import { questions, categories, type DiagnosticQuestion } from '@/lib/diagnosticData';
import { shuffleArray } from '@/lib/shuffle';

type MajorType = 'odo' | 'bang' | 'ab' | 'pyeo';

interface Response {
  questionId: string;
  image: string;
  category: string;
  correctMajorType: MajorType;
  selectedMajorType: MajorType | null;
}

const MAJOR_ORDER: MajorType[] = ['odo', 'bang', 'ab', 'pyeo'];
const QUESTIONS_PER_SESSION = 10;

function emptyResponses(ordered: DiagnosticQuestion[]): Response[] {
  return ordered.map((q) => ({
    questionId: q.id,
    image: q.image,
    category: q.category,
    correctMajorType: q.type,
    selectedMajorType: null,
  }));
}

function createSession() {
  const orderedQuestions = shuffleArray(questions).slice(0, QUESTIONS_PER_SESSION);
  return {
    orderedQuestions,
    responses: emptyResponses(orderedQuestions),
  };
}

export default function Diagnostic() {
  const [session, setSession] = useState(createSession);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [error, setError] = useState('');
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const { orderedQuestions, responses } = session;
  const questionCount = orderedQuestions.length;
  const currentQuestion = orderedQuestions[currentIndex];
  const progress = questionCount > 0 ? ((currentIndex + 1) / questionCount) * 100 : 0;
  const currentResponse = responses[currentIndex];

  const selectMajorType = useCallback((major: MajorType) => {
    setSession((prev) => {
      const next = [...prev.responses];
      if (next[currentIndex]) {
        next[currentIndex] = { ...next[currentIndex], selectedMajorType: major };
      }
      return { ...prev, responses: next };
    });
    setError('');
  }, [currentIndex]);

  const handleNext = () => {
    if (!currentResponse?.selectedMajorType) {
      setError('네 가지 대분류 중 하나를 선택해 주세요.');
      return;
    }
    if (currentIndex < questionCount - 1) {
      setImageStatus('loading');
      setCurrentIndex((i) => i + 1);
    } else {
      setShowNameInput(true);
    }
  };

  const handlePrevious = () => {
    if (showNameInput) {
      setShowNameInput(false);
      setImageStatus('loading');
      setCurrentIndex(questionCount - 1);
      return;
    }
    if (currentIndex > 0) {
      setImageStatus('loading');
      setCurrentIndex((i) => i - 1);
    }
  };

  const correctCount = responses.filter(
    (r) => r.selectedMajorType !== null && r.selectedMajorType === r.correctMajorType
  ).length;

  const handleSubmit = async () => {
    if (!userName.trim()) {
      setError('이름을 입력해주세요');
      return;
    }

    if (responses.some((r) => r.selectedMajorType === null)) {
      setError('모든 문항에 응답해주세요');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const wrongCount = questionCount - correctCount;

    try {
      const diagnosticsRef = ref(database, 'diagnostics');

      await push(diagnosticsRef, {
        name: userName,
        timestamp: new Date().toISOString(),
        mode: 'majorTypeClassification',
        responses: responses.map((r) => ({
          questionId: r.questionId,
          image: r.image,
          subcategory: r.category,
          selectedMajorType: r.selectedMajorType,
          correctMajorType: r.correctMajorType,
          isCorrect: r.selectedMajorType === r.correctMajorType,
        })),
        correctCount,
        wrongCount,
        accuracyPercent: Number(((correctCount / questionCount) * 100).toFixed(1)),
        totalQuestions: questionCount,
        questionPoolSize: questions.length,
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
    const accuracy = questionCount > 0 ? (correctCount / questionCount) * 100 : 0;
    const accuracyLabel =
      accuracy >= 80 ? '높음' : accuracy >= 50 ? '중간' : '낮음';
    const riskColor =
      accuracy >= 80
        ? 'bg-green-100 border-green-500'
        : accuracy >= 50
          ? 'bg-yellow-100 border-yellow-500'
          : 'bg-red-100 border-red-500';

    const wrongByMajor = responses.reduce(
      (acc, r) => {
        if (r.selectedMajorType !== r.correctMajorType) {
          const k = r.correctMajorType;
          acc[k] = (acc[k] || 0) + 1;
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
              {userName}님의 응답이 저장되었습니다.
            </p>

            <div className={`rounded-lg border-2 p-6 mb-8 ${riskColor}`}>
              <p className="text-sm text-gray-600 mb-2">대분류 구분 정확도</p>
              <p className="text-4xl font-bold text-gray-900">{accuracyLabel}</p>
              <p className="text-lg text-gray-700 mt-2">
                {correctCount} / {questionCount} 정답 ({accuracy.toFixed(1)}%)
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">📊 결과 요약</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  총 사례: <strong>{questionCount}개</strong>
                </p>
                <p>
                  정답(가이드 기준 대분류와 일치): <strong>{correctCount}개</strong>
                </p>
                <p>
                  불일치: <strong>{questionCount - correctCount}개</strong>
                </p>
              </div>

              {Object.keys(wrongByMajor).length > 0 && (
                <div className="mt-6 p-4 bg-amber-50 rounded border-l-4 border-amber-500">
                  <p className="text-sm text-gray-700 font-semibold mb-3">
                    정답 기준 대분류별 오답 수:
                  </p>
                  <div className="space-y-1 text-sm">
                    {Object.entries(wrongByMajor).map(([type, count]) => (
                      <p key={type} className="text-gray-700">
                        •{' '}
                        {type === 'odo'
                          ? '오도형'
                          : type === 'bang'
                            ? '방해형'
                            : type === 'ab'
                              ? '압박형'
                              : '편취유도형'}
                        : <strong>{count}개</strong>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 bg-blue-50 rounded border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">
                  💡 <strong>안내:</strong> 각 이미지는 가이드라인의 세부 유형과 대응되며, 정답
                  분류는 금융감독원 다크패턴 유형 체계(오도·방해·압박·편취유도)를 따릅니다.
                </p>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Link href="/" className="flex-1 min-w-[120px]">
                <button
                  type="button"
                  className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  홈으로
                </button>
              </Link>
              <Link href="/guidelines" className="flex-1 min-w-[120px]">
                <button
                  type="button"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  가이드라인 보기
                </button>
              </Link>
              <Link href="/community" className="flex-1 min-w-[120px]">
                <button
                  type="button"
                  className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                >
                  경험 공유
                </button>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSession(createSession());
                  setCurrentIndex(0);
                  setUserName('');
                  setShowNameInput(false);
                  setSubmitted(false);
                  setError('');
                  setImageStatus('loading');
                }}
                className="flex-1 min-w-[120px] bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
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
            응답을 Firebase에 기록하기 위해 이름을 입력해 주세요.
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowNameInput(false)}
              className="flex-1 bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-gray-400 transition-colors"
            >
              돌아가기
            </button>
            <button
              type="button"
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
          <button
            type="button"
            className="mb-8 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
          >
            ← 돌아가기
          </button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-900">진행률</h2>
              <span className="text-sm font-semibold text-indigo-600">
                {currentIndex + 1} / {questionCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {currentQuestion?.question}
            </h1>

            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-600 mb-3">사례 이미지</p>
              <div className="relative bg-gray-50 rounded-lg border-2 border-dashed border-gray-400 min-h-80 overflow-hidden flex items-center justify-center">
                {imageStatus !== 'loaded' && (
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center p-6 z-0 ${
                      imageStatus === 'error' ? '' : 'animate-pulse'
                    }`}
                  >
                    <p className="text-5xl mb-3">{imageStatus === 'error' ? '🖼️' : '⏳'}</p>
                    <p className="text-gray-600 font-semibold">
                      {imageStatus === 'error' ? '이미지를 불러오지 못했습니다' : '이미지 로딩 중…'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{currentQuestion?.image}</p>
                  </div>
                )}
                <Image
                  src={currentQuestion?.image}
                  alt={`사례 ${currentIndex + 1}`}
                  width={1200}
                  height={800}
                  unoptimized
                  className={`relative z-10 w-full max-h-[28rem] object-contain p-4 ${
                    imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageStatus('loaded')}
                  onError={() => setImageStatus('error')}
                />
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
              <p className="text-gray-700">
                <span className="font-bold">참고 설명:</span> {currentQuestion?.description}
              </p>
            </div>
          </div>

          <p className="text-sm font-bold text-gray-800 mb-3">대분류 선택 (하나만)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {MAJOR_ORDER.map((key) => {
              const cat = categories[key];
              const selected = currentResponse?.selectedMajorType === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectMajorType(key)}
                  className={`text-left rounded-xl border-2 px-4 py-4 transition-all ${
                    selected
                      ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-300'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mr-2">{cat.icon}</span>
                  <span className="font-bold text-gray-900">{cat.title}</span>
                  <p className="text-xs text-gray-600 mt-2 leading-snug">{cat.description}</p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex-1 bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← 이전
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              {currentIndex >= questionCount - 1 ? '응답 완료 · 이름 입력' : '다음 →'}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          15개 사례 중 무작위로 나온 10개를 보고 오도형·방해형·압박형·편취유도형 중 하나를 골라 주세요.
          마지막 문항에서 응답을 마치면 이름을 입력하고 Firebase Realtime Database에 저장됩니다.
        </div>
      </div>
    </div>
  );
}
