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
    <div className="min-h-screen bg-[#FFF8F5] px-4 py-10 font-sans">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#8A1601]">강의 묻고답하기</h1>

        {/* 상단 검색 필터 */}
        <div className="flex flex-wrap gap-2 items-center mb-4">
          {student && (
            <div className="ml-auto">
              <button
                className="bg-[#8A1601] text-white px-4 py-1 text-sm rounded hover:bg-[#a3200a] transition"
                onClick={() => navigate(`/question/${lecture_id}/write`)}
              >
                글쓰기
              </button>
            </div>
          )}
        </div>

        {/* 테이블 형식 목록 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-t-2">
            <thead className="bg-gray-100 text-[#333]">
              <tr>
                <th className="border px-3 py-2">번호</th>
                <th className="border px-3 py-2 text-left">제목</th>
                <th className="border px-3 py-2">작성자</th>
                <th className="border px-3 py-2">작성일</th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    글이 없습니다.
                  </td>
                </tr>
              ) : (
                questions.map((q, idx) => (
                  <tr
                    key={q.id}
                    className="text-center border-t hover:bg-[#fdf5f3] cursor-pointer"
                    onClick={() => navigate(`/question/${lecture_id}/${q.id}`)}
                  >
                    <td className="py-2 px-3">{questions.length - idx}</td>
                    <td className="py-2 px-3 text-left text-[#8A1601] font-medium">{q.title}</td>
                    <td className="py-2 px-3">{q.writer_id || '작성자'}</td>
                    <td className="py-2 px-3">
                      {new Date(q.createdAt).toISOString().slice(0, 10)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 */}
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-3 py-1 rounded border text-sm font-medium ${
              page === 1
                ? 'bg-gray-300 text-white cursor-not-allowed'
                : 'bg-[#8A1601] text-white hover:bg-[#a3200a]'
            }`}
          >
            이전
          </button>
          <span className="text-sm font-medium text-[#8A1601]">페이지 {page}</span>
          <button
            onClick={handleNext}
            className="px-3 py-1 rounded border text-sm font-medium bg-[#8A1601] text-white hover:bg-[#a3200a]"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
