import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';

const days = ['월', '화', '수', '목', '금'];
const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Timetable = () => {
  const [timetable, setTimetable] = useState({});
  const { student } = useContext(UserContext);

  if (!student) return <div>로그인 정보를 불러오는 중입니다...</div>;

  const studentId = student.id;  // ✅ 일관되게 .id 사용

  useEffect(() => {
    if (!studentId) return;

    fetch(`http://localhost:3000/enroll/enrollments/${studentId}`)
      .then(res => res.json())
      .then(data => {
        const grid = {};
        for (let day of days) grid[day] = Array(9).fill('');

        for (const enr of data) {
          const lec = enr.Lecture;
          for (const t of lec.scheduleTimes) {
            grid[lec.scheduleDay][t - 1] = (
              <div style={{ fontSize: '0.85em', lineHeight: '1.4' }}>
                <strong>{lec.title}</strong><br />
                {lec.course_id}-{lec.sec_id}<br />
                {lec.professor}<br />
                {lec.building} {lec.room_number}
              </div>
            );
          }
        }

        setTimetable(grid);
      })
      .catch(err => console.error('시간표 불러오기 실패:', err));
  }, [studentId]);

  return (
    <div>
      <h2>📅 내 시간표</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>교시</th>
            {days.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map(period => (
            <tr key={period}>
              <td>{period}교시</td>
              {days.map(day => (
                <td key={day} style={{ minWidth: '120px', verticalAlign: 'top' }}>
                  {timetable[day]?.[period - 1] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
