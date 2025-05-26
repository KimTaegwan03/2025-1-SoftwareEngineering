import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const EnrollPage = () => {
  const [lectures, setLectures] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { student } = useContext(UserContext);

  const studentId = student?.id;  // ✅ 일관되게 .id 사용

  // 전체 강의 불러오기
  useEffect(() => {
    fetch('http://localhost:3000/lecture/list')
      .then(res => res.json())
      .then(data => setLectures(data))
      .catch(err => console.error('불러오기 실패:', err));
  }, []);

  // 신청 내역 불러오기
  useEffect(() => {
    if (!studentId) return;
    fetch(`http://localhost:3000/enroll/enrollments/${studentId}`)
      .then(res => res.json())
      .then(data => setEnrolled(data))
      .catch(err => console.error('수강 내역 실패:', err));
  }, [studentId]);

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
      <div style={{ flex: 1 }}>
        <h2>전체 강의 목록</h2>
        {message && <p>{message}</p>}
        <table border="1" cellPadding="8">
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
            {lectures.map(lec => (
              <tr key={lec.id}>
                <td>{lec.title}</td>
                <td>{lec.professor}</td>
                <td>{lec.credit}</td>
                <td>{lec.scheduleDay} {lec.scheduleTimes.join(', ')}</td>
                <td><button onClick={() => handleEnroll(lec.id)}>신청</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
