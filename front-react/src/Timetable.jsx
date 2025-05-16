import React, { useEffect, useState } from 'react';

const days = ['월', '화', '수', '목', '금'];
const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Timetable = () => {
  const [timetable, setTimetable] = useState({});

  useEffect(() => {
    fetch('http://localhost:3000/enroll/enrollments/1')  // 나중에 로그인한 사용자 ID로 변경
      .then(res => res.json())
      .then(data => {
        const grid = {};

        // 요일별 빈 시간표 9교시까지 초기화
        for (let day of days) {
          grid[day] = Array(9).fill('');
        }

        for (const enr of data) {
          const lec = enr.Lecture;

          for (const t of lec.scheduleTimes) {
            grid[lec.scheduleDay][t - 1] = (
              <div>
                <div><strong>{lec.title}</strong></div>
                <div>{lec.course_id}-{lec.sec_id}</div>
                <div>{lec.professor}</div>
                <div>{lec.building} {lec.room_number}</div>
              </div>
            );
          }
        }

        setTimetable(grid);
      })
      .catch(err => console.error('시간표 불러오기 실패', err));
  }, []);

  return (
    <div>
      <h2>📅 내 시간표</h2>
      <table border="1" cellPadding="10">
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
                <td key={day}>
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
