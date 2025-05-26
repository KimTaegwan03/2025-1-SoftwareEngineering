import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const EnrollPage = () => {
  const [lectures, setLectures] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');          // 검색어 상태
  const navigate = useNavigate();
  const { student } = useContext(UserContext);

  const studentId = student?.id;  // 로그인한 학생 ID

  // 전체 강의 불러오기
  useEffect(() => {
    fetch('http://localhost:3000/lecture/list')
      .then(res => res.json())
      .then(data => setLectures(data))
      .catch(err => console.error('불러오기 실패:', err));
  }, []);

  // 내 신청 내역 불러오기
  useEffect(() => {
    if (!studentId) return;
    fetch(`http://localhost:3000/enroll/enrollments/${studentId}`)
      .then(res => res.json())
      .then(data => setEnrolled(data))
      .catch(err => console.error('수강 내역 실패:', err));
  }, [studentId]);

  // 검색어 기반 필터링
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

  const refreshEnrolled = () => {
    if (!studentId) return;
    fetch(`http://localhost:3000/enroll/enrollments/${studentId}`)
      .then(res => res.json())
      .then(data => setEnrolled(data))
      .catch(err => console.error('수강 목록 새로고침 오류:', err));
  };

  if (!student) return <div>로그인 정보를 불러오는 중입니다...</div>;

  return (
    <div style={{ display: 'flex', gap: '40px' }}>
      {/* 전체 강의 목록 */}
      <div style={{ flex: 1 }}>
        <h2>전체 강의 목록</h2>

        {/* 검색창 */}
        <input
          type="text"
          placeholder="강의명·교수명·과목코드로 검색"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            marginBottom: '12px',
            padding: '6px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />

        {message && <p>{message}</p>}

        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>강의명</th>
              <th>교수</th>
              <th>학점</th>
              <th>시간</th>
              <th>신청</th>
            </tr>
          </thead>
          <tbody>
            {filteredLectures.map(lec => (
              <tr key={lec.id}>
                <td>{lec.title}</td>
                <td>{lec.professor}</td>
                <td>{lec.credit}</td>
                <td>{lec.scheduleDay} {lec.scheduleTimes.join(', ')}</td>
                <td>
                  <button onClick={() => handleEnroll(lec.id)}>신청</button>
                </td>
              </tr>
            ))}
            {filteredLectures.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 내 수강 목록 */}
      <div style={{ flex: 1 }}>
        <h2>내 수강 목록</h2>
        <ul>
          {enrolled.map(en => (
            <li key={en.id}>
              {en.Lecture.title} ({en.Lecture.scheduleDay} {en.Lecture.scheduleTimes.join(', ')})
              <button onClick={() => handleUnenroll(en.lecture_id)} style={{ marginLeft: '10px' }}>
                수강 포기
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/timetable')}>시간표 확인하기</button>
      </div>
    </div>
  );
};

export default EnrollPage;
