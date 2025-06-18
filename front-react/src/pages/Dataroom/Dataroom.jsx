import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InstructorContext } from '@/InstructorContext';
import { UserContext } from '@/UserContext';

export default function Dataroom() {
  const { lecture_id } = useParams();
  const navigate = useNavigate();
  const { instructor } = useContext(InstructorContext);
  const { student } = useContext(UserContext);

  const [page, setPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/data?lecture_id=${lecture_id}`);
        const data = await res.json();
        setDatas(data); // 최신순 정렬
      } catch (err) {
        console.error('데이터 가져오기 실패:', err);
      }
    };
    getData();
  }, [lecture_id]);

  const totalPages = Math.ceil(datas.length / itemsPerPage);
  const currentData = datas.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-[#FFF8F5] px-4 py-10 font-sans">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#8A1601]">자료실</h1>

        {instructor && (
          <div className="text-right mb-3">
            <button
              className="bg-[#8A1601] text-white py-2 px-4 text-sm rounded hover:bg-[#a3200a] transition"
              onClick={() => navigate(`/data/${lecture_id}/write`)}
            >
              글 쓰기
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-[#8A1601] text-white">
              <tr>
                <th className="py-2 px-3 border">번호</th>
                <th className="py-2 px-3 border">제목</th>
                <th className="py-2 px-3 border">작성자</th>
                <th className="py-2 px-3 border">작성일</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((a, idx) => (
                <tr
                  key={a.id}
                  className="text-center border-t hover:bg-[#fdf5f3] cursor-pointer"
                  onClick={() => navigate(`/data/${lecture_id}/${a.id}`)}
                >
                  <td className="py-2 px-3">
                    {datas.length - ((page - 1) * itemsPerPage + idx)}
                  </td>
                  <td className="py-2 px-3 text-left text-[#8A1601] font-medium">
                    {a.title}
                  </td>
                  <td className="py-2 px-3">{a.writer || '작성자'}</td>
                  <td className="py-2 px-3">
                    {new Date(a.createdAt).toISOString().slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
          <span className="text-sm font-medium text-[#8A1601]">
            페이지 {page} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border text-sm font-medium bg-[#8A1601] text-white hover:bg-[#a3200a]"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
