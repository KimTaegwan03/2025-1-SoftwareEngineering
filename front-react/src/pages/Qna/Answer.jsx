import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { InstructorContext } from '@/InstructorContext';
import { UserContext } from '@/UserContext';

export function AnswerList({ question_id }) {
  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState([]);

  const getData = async (pageNum) => {
    try {
      const res = await fetch(`http://localhost:3000/answer?question_id=${question_id}&page=${pageNum}`);
      const data = await res.json();
      setAnswers(data);
    } catch (err) {
      console.error('데이터 가져오기 실패:', err);
    }
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="space-y-3">
        {answers.length > 0 ? (
          answers.map((answer) => (
            <div
              key={answer.id}
              className="flex justify-between items-start bg-white border border-gray-300 rounded-md p-4"
            >
              <p className="text-gray-800">{answer.content}</p>
              <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                {new Date(answer.createdAt).toISOString().slice(0, 10)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">아직 등록된 답변이 없습니다.</p>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-5">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          이전
        </button>
        <span>페이지 {page}</span>
        <button
          onClick={handleNext}
          className="px-3 py-1 border rounded"
        >
          다음
        </button>
      </div>
    </div>
  );
}

export function AnswerForm({ question_id }) {
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/answer/write?question_id=${question_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include',
      });

      if (res.ok) {
        setContent('');
        navigate(0);
      } else {
        alert('답변 등록 실패');
      }
    } catch (err) {
      console.error(err);
      alert('오류 발생');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto mt-6 px-4 flex flex-col gap-2"
    >
      <textarea
        placeholder="답변 내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full min-h-[80px] max-h-[200px] border rounded p-2 resize-y"
      />
      <button
        type="submit"
        className="self-end bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        답변 등록
      </button>
    </form>
  );
}
