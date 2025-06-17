import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const EnrollPage = () => {
  const [lectures, setLectures] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { student } = useContext(UserContext);
  const studentId = student?.id;

  useEffect(() => {
    fetch('http://localhost:3000/lecture/list')
      .then(res => res.json())
      .then(data => setLectures(data))
      .catch(err => console.error('불러오기 실패:', err));
  }, []);

  useEffect(() => {
    if (!studentId) return;
    fetch(`http://localhost:3000/enroll/enrollments/${studentId}`)
      .then(res => res.json())
      .then(data => setEnrolled(data))
      .catch(err => console.error('수강 내역 실패:', err));
  }, [studentId]);

  const refreshEnrolled = () => {
    if (!studentId) return;
    fetch(`http://localhost:3000/enroll/enrollments/${studentId}`)
      .then(res => res.json())
      .then(data => setEnrolled(data))
      .catch(err => console.error('수강 목록 새로고침 오류:', err));
  };

  const filteredLectures = lectures.filter(lec => {
    const q = query.toLowerCase();
    return (
      lec.title.toLowerCase().includes(q) ||
      lec.professor.toLowerCase().includes(q) ||
      lec.course_id.toLowerCase().includes(q)
    );
  });

  const handleEnroll = async (lectureId) => {
    try {
      const res = await fetch(`http://localhost:3000/enroll/${lectureId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        refreshEnrolled();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error('신청 오류:', err);
    }
  };

  const handleUnenroll = async (lectureId) => {
    try {
      const res = await fetch(`http://localhost:3000/enroll/${lectureId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(`🗑️ ${data.message}`);
        refreshEnrolled();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error('수강 포기 오류:', err);
    }
  };

  if (!student) return <div className="text-center py-8 text-lg">로그인 정보를 불러오는 중입니다...</div>;

  return (
    <div className="min-h-screen bg-[#FFF8F5] p-6 flex gap-10 flex-col lg:flex-row">
      {/* 전체 강의 목록 */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl font-bold text-[#8A1601] mb-4">전체 강의 목록</h2>

        <input
          type="text"
          placeholder="강의명·교수명·과목코드로 검색"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-[#8A1601] rounded"
        />

        {message && <p className="mb-4 text-sm text-green-700">{message}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-[#8A1601]">
            <thead>
              <tr className="bg-[#8A1601] text-white">
                <th className="py-2 px-3 border border-[#8A1601]">강의명</th>
                <th className="py-2 px-3 border border-[#8A1601]">교수</th>
                <th className="py-2 px-3 border border-[#8A1601]">학점</th>
                <th className="py-2 px-3 border border-[#8A1601]">시간</th>
                <th className="py-2 px-3 border border-[#8A1601]">신청</th>
              </tr>
            </thead>
            <tbody>
              {filteredLectures.map(lec => (
                <tr key={lec.id} className="bg-white even:bg-[#FAEEE7]">
                  <td className="py-2 px-3 border border-[#8A1601]">{lec.title}</td>
                  <td className="py-2 px-3 border border-[#8A1601]">{lec.professor}</td>
                  <td className="py-2 px-3 border border-[#8A1601]">{lec.credit}</td>
                  <td className="py-2 px-3 border border-[#8A1601]">{lec.scheduleDay} {lec.scheduleTimes.join(', ')}</td>
                  <td className="py-2 px-3 border border-[#8A1601]">
                    <button
                      onClick={() => handleEnroll(lec.id)}
                      className="bg-[#8A1601] text-white px-3 py-1 rounded hover:bg-[#6c1100] transition"
                    >
                      신청
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLectures.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">검색 결과가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 내 수강 목록 */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl font-bold text-[#8A1601] mb-4">내 수강 목록</h2>
        <ul className="space-y-2 mb-6">
          {enrolled.map(en => (
            <li key={en.id} className="flex justify-between items-center border-b pb-1">
              <span>
                {en.Lecture.title} ({en.Lecture.scheduleDay} {en.Lecture.scheduleTimes.join(', ')})
              </span>
              <button
                onClick={() => handleUnenroll(en.lecture_id)}
                className="ml-2 text-sm text-red-700 hover:underline"
              >
                수강 포기
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => navigate('/timetable')}
          className="bg-[#8A1601] text-white px-4 py-2 rounded hover:bg-[#6c1100] transition"
        >
          시간표 확인하기
        </button>
      </div>
    </div>
  );
};

export default EnrollPage;
