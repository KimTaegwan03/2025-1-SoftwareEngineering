import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { InstructorContext } from '@/InstructorContext';
import { UserContext } from '@/UserContext';

export default function Assignment() {
  const { lecture_id } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]); // 제출한 과제 id만 포함
  const { instructor } = useContext(InstructorContext);
  const { student } = useContext(UserContext);

  const getAssignment = async (pageNum) => {
    try {
      const res = await fetch(
        `http://localhost:3000/assignment?lecture_id=${lecture_id}&page=${pageNum}`
      );
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error('데이터 가져오기 실패:', err);
    }
  };

  const getSubmissions = async () => {
    try {
      const results = await Promise.all(
        assignments.map(async (assignment) => {
          const res = await fetch(`http://localhost:3000/assignment/submit/${assignment.id}`, {
            credentials: 'include',
          });
          const data = await res.json();  // 이건 submission 하나
          return data.assignment_id;
        })
      );
      setSubmissions(results); // 전체 리스트로 저장
    } catch (err) {
      console.error('과제 조회 실패:', err);
    }
  };

  const utc2ko = (utcString) => {
    const date = new Date(utcString);
    const offset = date.getTimezoneOffset() * 60000;
    const kstTime = new Date(date.getTime() - offset + 9 * 60 * 60000);
    
    // "2025-06-17 15:00:00" 형식
    return kstTime.toISOString().slice(0, 19).replace('T', ' ');
  }

  useEffect(() => {
    getAssignment(page);
  }, [page]);

  useEffect(() => {
    getSubmissions();
  }, [assignments]);

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-[#FFF8F5] px-4 py-10 font-sans w-full">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#8A1601]">과제</h1>

        {instructor && (
          <div className="text-right mb-3">
            <button
              className="bg-[#8A1601] text-white py-2 px-4 text-sm rounded hover:bg-[#a3200a] transition"
              onClick={() => navigate(`/assignment/${lecture_id}/write`)}
            >
              글 쓰기
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-[#8A1601] text-white">
              <tr>
                <th className="py-2 px-3 border">No</th>
                <th className="py-2 px-3 border">과제 제목</th>
                <th className="py-2 px-3 border">제출기한</th>
                <th className="py-2 px-3 border">상태</th>
                <th className="py-2 px-3 border">조회</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, idx) => (
                <tr key={a.id} className="text-center border-t">
                  <td className="py-2 px-3">{assignments.length - idx}</td>
                  <td className="py-2 px-3 text-left text-[#8A1601] font-medium">
                    {a.title}
                  </td>
                  <td className="py-2 px-3">
                    {a.start_dt && a.end_dt ? (
                      <>
                        <p>{utc2ko(a.start_dt)}</p>
                        <p>~ {utc2ko(a.end_dt)}</p>
                      </>
                    ) : (
                      <p>-</p>
                    )}
                  </td>
                  <td className="py-2 px-3">{(submissions.includes(a.id)) ? '제출' : '미제출'}</td>
                  <td className="py-2 px-3">
                    <button className="bg-gray-700 text-white px-3 py-1 text-xs rounded"
                        onClick={() => navigate(`/assignment/${lecture_id}/${a.id}`)}>
                          조회
                    </button>
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
