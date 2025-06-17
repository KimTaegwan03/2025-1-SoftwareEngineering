import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { InstructorContext } from '@/InstructorContext';
import { UserContext } from '@/UserContext';

export default function Question() {
  const { lecture_id } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const { instructor } = useContext(InstructorContext);
  const { student } = useContext(UserContext);

  const getData = async (pageNum) => {
    try {
      const res = await fetch(
        `http://localhost:3000/question?lecture_id=${lecture_id}&page=${pageNum}`
      );
      const data = await res.json();
      setQuestions(data);
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
    <div className="min-h-screen bg-[#FFF8F5] flex flex-col items-center justify-center px-4 py-10 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-[#8A1601]">질문</h1>

      {student && (
        <div className="w-full max-w-2xl text-right mb-5">
          <button
            className="bg-[#8A1601] text-white py-2 px-4 text-sm rounded hover:bg-[#a3200a] transition"
            onClick={() => navigate(`/question/${lecture_id}/write`)}
          >
            글 쓰기
          </button>
        </div>
      )}

      <div className="w-full max-w-2xl space-y-3">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-white border border-[#D9B6AE] rounded-lg p-4 flex justify-between items-center"
          >
            <button
              className="text-lg font-semibold text-left text-[#8A1601] hover:underline w-full truncate"
              onClick={() => navigate(`/question/${lecture_id}/${question.id}`)}
            >
              {question.title}
            </button>
            <span className="ml-4 text-sm text-gray-600 whitespace-nowrap">
              {new Date(question.createdAt).toISOString().slice(0, 10)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center space-x-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={`px-3 py-1 rounded border ${
            page === 1
              ? 'bg-gray-300 text-white cursor-not-allowed'
              : 'bg-[#8A1601] text-white hover:bg-[#a3200a]'
          }`}
        >
          이전
        </button>
        <span className="text-sm">페이지 {page}</span>
        <button
          onClick={handleNext}
          className="px-3 py-1 rounded border bg-[#8A1601] text-white hover:bg-[#a3200a]"
        >
          다음
        </button>
      </div>
    </div>
  );
}
