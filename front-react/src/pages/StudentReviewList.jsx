import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentReviewList() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/lecture/list', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('강의 목록 조회 실패');
        return res.json();
      })
      .then(data => setLectures(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-[#8A1601] text-lg">
        강의 목록 불러오는 중…
      </div>
    );

  if (!lectures.length)
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center text-gray-600 text-lg">
        등록된 강의가 없습니다.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FFF8F5] py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow border border-[#8A1601] p-6">
        <h2 className="text-2xl font-bold text-[#8A1601] mb-6 text-center">전체 강의 (리뷰)</h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-[#8A1601]">
            <thead className="bg-[#8A1601] text-white">
              <tr>
                <th className="px-4 py-2 border">강의코드</th>
                <th className="px-4 py-2 border">분반</th>
                <th className="px-4 py-2 border">강의명</th>
                <th className="px-4 py-2 border">교수</th>
                <th className="px-4 py-2 border">년도 / 학기</th>
                <th className="px-4 py-2 border">리뷰 보기</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map(lec => (
                <tr key={lec.id} className="hover:bg-[#FFF1EB]">
                  <td className="px-4 py-2 border text-center">{lec.course_id}</td>
                  <td className="px-4 py-2 border text-center">{lec.sec_id}</td>
                  <td className="px-4 py-2 border">{lec.title}</td>
                  <td className="px-4 py-2 border text-center">{lec.professor}</td>
                  <td className="px-4 py-2 border text-center">
                    {lec.year} / {lec.semester}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => navigate(`/lecture/${lec.id}/reviews`)}
                      className="bg-[#8A1601] text-white px-3 py-1 rounded hover:bg-[#6c1100] transition"
                    >
                      리뷰 보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
