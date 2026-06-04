'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  limitToLast,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  serverTimestamp,
} from 'firebase/database';
import { database } from '@/lib/firebase';

type ExperienceType = 'subscription' | 'finance' | 'shopping' | 'privacy' | 'other';

interface CommunityPost {
  id: string;
  name: string;
  type: ExperienceType;
  content: string;
  createdAt: number;
}

const typeLabels: Record<ExperienceType, string> = {
  subscription: '가입·해지',
  finance: '금융상품',
  shopping: '결제·쇼핑',
  privacy: '개인정보·동의',
  other: '기타',
};

const typeOptions = Object.entries(typeLabels) as [ExperienceType, string][];

function formatDate(value: number) {
  if (!Number.isFinite(value)) {
    return '방금 전';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<ExperienceType>('subscription');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const postsQuery = query(
      ref(database, 'communityPosts'),
      orderByChild('createdAt'),
      limitToLast(30)
    );

    const unsubscribe = onValue(
      postsQuery,
      (snapshot) => {
        const value = snapshot.val() as
          | Record<string, Omit<CommunityPost, 'id'>>
          | null;

        const nextPosts = value
          ? Object.entries(value).map(([id, post]) => ({
              id,
              name: post.name || '익명',
              type: post.type || 'other',
              content: post.content || '',
              createdAt: Number(post.createdAt) || 0,
            }))
          : [];

        nextPosts.sort((a, b) => b.createdAt - a.createdAt);
        setPosts(nextPosts);
        setIsLoading(false);
      },
      () => {
        setError('게시글을 불러오지 못했습니다. Firebase 설정을 확인해주세요.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const remaining = useMemo(() => 500 - content.length, [content]);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedContent = content.trim();

    setError('');
    setSuccess('');

    if (trimmedName.length < 2) {
      setError('이름은 2자 이상 입력해주세요.');
      return;
    }

    if (trimmedContent.length < 10) {
      setError('경험 내용은 10자 이상 입력해주세요.');
      return;
    }

    if (trimmedContent.length > 500) {
      setError('경험 내용은 500자 이내로 작성해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await push(ref(database, 'communityPosts'), {
        name: trimmedName.slice(0, 20),
        type,
        content: trimmedContent,
        createdAt: Date.now(),
        serverCreatedAt: serverTimestamp(),
      });

      setContent('');
      setSuccess('경험이 공유되었습니다.');
    } catch (err) {
      setError('게시글 저장에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/">
          <button
            type="button"
            className="mb-8 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
          >
            ← 돌아가기
          </button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            다크패턴 경험 공유
          </h1>
          <p className="text-lg text-gray-600">
            실제로 마주친 불편한 화면과 선택 유도 경험을 간단히 기록해 주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[22rem_1fr] gap-6 items-start">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5">경험 작성</h2>

            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value.slice(0, 20));
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="이름 또는 닉네임"
            />

            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="type">
              경험 유형
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as ExperienceType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
            >
              {typeOptions.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700" htmlFor="content">
                경험 내용
              </label>
              <span className={`text-xs ${remaining < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {remaining}자 남음
              </span>
            </div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError('');
                setSuccess('');
              }}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 resize-none"
              placeholder="예: 해지 버튼을 찾기 어려웠거나, 결제 직전에 예상하지 못한 수수료가 표시된 경험"
            />

            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            {success && <p className="text-sm text-green-700 mb-3">{success}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '등록 중...' : '경험 공유하기'}
            </button>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-bold text-gray-900">최근 공유</h2>
              <span className="text-sm font-semibold text-gray-500">
                최대 30개 표시
              </span>
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-gray-500 font-semibold">
                게시글을 불러오는 중...
              </div>
            ) : posts.length === 0 ? (
              <div className="py-16 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-700 font-bold mb-2">아직 공유된 경험이 없습니다.</p>
                <p className="text-sm text-gray-500">첫 번째 경험을 남겨주세요.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="border border-gray-200 rounded-lg p-5 bg-gray-50"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="font-bold text-gray-900">{post.name}</span>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">
                        {typeLabels[post.type] || typeLabels.other}
                      </span>
                      <time className="text-xs text-gray-500 ml-auto">
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {post.content}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
