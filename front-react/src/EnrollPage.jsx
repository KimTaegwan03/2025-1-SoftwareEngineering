import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EnrollPage = () => {
  const [lectures, setLectures] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // 전체 강의 불러오기
  useEffect(() => {
    fetch('http://localhost:3000/lecture/list')
      .then(res => res.json())
      .then(data => setLectures(data))
      .catch(err => console.error('불러오기 실패:', err));
  }, []);

  // 현재 신청 목록 불러오기
  const loadEnrolled = () => {
    fetch('http://localhost:3000/enroll/enrollments/1') // studentId = 1
      .then(res => res.json())
      .then(data => setEnrolled(data));
  };

  useEffect(loadEnrolled, []);

  const handleEnroll = async (lectureId) => {
    const res = await fetch(`http://localhost:3000/enroll/${lectureId}`, { method: 'POST' });
    const data = await res.json();

    if (res.ok) {
      setMessage(`✅ ${data.message}`);
      loadEnrolled(); // 목록 갱신
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  const handleUnenroll = async (lectureId) => {
    const res = await fetch(`http://localhost:3000/enroll/${lectureId}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      setMessage(`🗑️ ${data.message}`);
      loadEnrolled();
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

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
              <button onClick={() => handleUnenroll(en.lectureId)} style={{ marginLeft: '10px' }}>
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
