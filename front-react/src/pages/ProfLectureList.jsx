// src/pages/ProfLectureList.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { InstructorContext } from '../InstructorContext';

const ProfLectureList = () => {
  const { instructor } = useContext(InstructorContext);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // instructor 정보가 준비되어야만 API 호출
    if (!instructor) return;

    // ✅ 수정 부분: 파라미터 없이 세션 기반으로 호출
    fetch('http://localhost:3000/lecture/instructor', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('강의 목록 조회 실패');
        return res.json();
      })
      .then(data => {
        setLectures(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('교수용 강의 목록 불러오기 실패:', err);
        setError('교수용 강의 목록을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      });
  }, [instructor]);

  if (!instructor) {
    return <div>교수 정보를 불러오는 중입니다...</div>;
  }
  if (loading) {
    return <div>담당 강의 목록을 불러오는 중입니다...</div>;
  }
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }
  if (!lectures.length) {
    return <div>담당 강의가 없습니다.</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>내 강의 목록 (교수용)</h2>
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: 'collapse', width: '100%' }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th>강의코드</th>
            <th>분반</th>
            <th>강의명</th>
            <th>학과명</th>
            <th>학점</th>
            <th>학기</th>
            <th>연도</th>
            <th>강의실</th>
            <th>최대인원</th>
            <th>통계</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map(lec => (
            <tr key={lec.id}>
              <td>{lec.course_id}</td>
              <td>{lec.sec_id}</td>
              <td>{lec.title}</td>
              <td>{lec.dept_name}</td>
              <td>{lec.credit}</td>
              <td>{lec.semester}</td>
              <td>{lec.year}</td>
              <td>
                {lec.building} {lec.room_number}
              </td>
              <td>{lec.maxSeats}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/professor/lecture/${lec.id}/stats`)
                  }
                >
                  통계 보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfLectureList;
