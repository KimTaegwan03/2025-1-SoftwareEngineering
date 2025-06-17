import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ 답변 리스트 컴포넌트
export function AnswerList({ question_id }) {
  const [answers, setAnswers] = useState([]);

  const getData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/answer?question_id=${question_id}`);
      const data = await res.json();
      setAnswers(data);
    } catch (err) {
      console.error('데이터 가져오기 실패:', err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="space-y-3">
        {answers.length > 0 ? (
          answers.map((answer) => (
            <div
              key={answer.id}
              className="flex justify-between items-start bg-white border border-[#D9B6AE] rounded-md p-4"
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
    </div>
  );
}

// ✅ 답변 작성 폼 컴포넌트
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
        navigate(0); // 새로고침
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
      className="w-full max-w-2xl mx-auto mt-8 px-4 flex flex-col gap-3"
    >
      <textarea
        placeholder="답변 내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full min-h-[100px] max-h-[200px] border border-gray-300 rounded p-3 resize-y focus:outline-none focus:ring-2 focus:ring-[#8A1601]"
      />
      <button
        type="submit"
        className="self-end bg-[#8A1601] text-white font-semibold px-5 py-2 rounded hover:bg-[#6c1100] transition"
      >
        답변 등록
      </button>
    </form>
  );
}
