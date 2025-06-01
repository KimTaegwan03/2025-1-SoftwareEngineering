// src/pages/Timetable.jsx
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';

const days = ['월', '화', '수', '목', '금'];
const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// 강의별로 돌아가며 사용할 미리 정의된 팔레트
const PALETTE = [
  '#FFB3BA',
  '#FFDFBA',
  '#FFFFBA',
  '#BAFFC9',
  '#BAE1FF',
  '#D7BAFF',
  '#FFBAED',
  '#B0E0E6',
  '#FFDAB9'
];

const Timetable = () => {
  const { student } = useContext(UserContext);
  const [timetable, setTimetable] = useState({});   // { 월: [lecObj or ''], 화: [...], ... }
  const [colorMap, setColorMap] = useState({});     // { lectureId: '#hex', ... }

  if (!student) {
    return <div>로그인 정보를 불러오는 중입니다...</div>;
  }
  const studentId = student.id;

  useEffect(() => {
    if (!studentId) return;

    fetch(`http://localhost:3000/enroll/enrollments/${studentId}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('시간표 조회 중 오류 발생');
        }
        return res.json();
      })
      .then(data => {
        // 1) 먼저 그리드를 초기화합니다.
        // days별로 9칸짜리 빈 배열을 만들어 줌.
        const grid = {};
        for (let day of days) {
          grid[day] = Array(periods.length).fill('');
        }

        // 2) 강의 ID 목록을 뽑아서 중복 제거한 뒤, 색상을 매핑할 colorMap 생성
        const uniqueLectures = {};
        data.forEach(enr => {
          const lec = enr.Lecture;         // 예: { id, title, course_id, sec_id, professor, building, room_number, scheduleDay, scheduleTimes }
          if (lec && lec.id !== undefined) {
            uniqueLectures[lec.id] = lec;
          }
        });
        const lectureIds = Object.keys(uniqueLectures); // ['3','5','9', ...]
        const newColorMap = {};
        lectureIds.forEach((lecId, idx) => {
          newColorMap[lecId] = PALETTE[idx % PALETTE.length];
        });
        setColorMap(newColorMap);

        // 3) 그리드에 실제 lec 객체를 저장
        data.forEach(enr => {
          const lec = enr.Lecture;
          if (!lec) return;
          // lec.scheduleTimes가 [2,3,4] 형태라고 가정
          if (!Array.isArray(lec.scheduleTimes)) return;

          lec.scheduleTimes.forEach(t => {
            const day = lec.scheduleDay;
            const idx = t - 1; // 예: 2교시라면 index=1
            if (grid[day] && idx >= 0 && idx < 9) {
              grid[day][idx] = lec;
            }
          });
        });

        setTimetable(grid);
      })
      .catch(err => {
        console.error('❌ 시간표 불러오기 실패:', err);
      });
  }, [studentId]);

  return (
    <div>
      <h2>📅 내 시간표</h2>
      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          textAlign: 'center'
        }}
      >
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
              {/* 왼쪽 첫 번째 열: 교시 라벨 */}
              <td
                style={{
                  fontWeight: 'bold',
                  backgroundColor: '#f0f0f0',
                  width: '80px'
                }}
              >
                {period}교시
              </td>

              {days.map(day => {
                // grid[day][period-1] 을 꺼내 lec 객체인지 확인
                const cellValue =
                  timetable[day] && Array.isArray(timetable[day])
                    ? timetable[day][period - 1]
                    : '';

                // 만약 lec 객체가 있으면, 해당 lec.id로 색상을 불러와서 배경색 지정
                if (cellValue && cellValue.id) {
                  const lec = cellValue;
                  const bgColor = colorMap[lec.id] || '#ccc';

                  return (
                    <td
                      key={day}
                      style={{
                        minWidth: '120px',
                        verticalAlign: 'top',
                        backgroundColor: bgColor,
                        color: 'black',
                        border: '1px solid #999'
                      }}
                    >
                      <div style={{ fontSize: '0.9em', lineHeight: '1.3' }}>
                        <strong>{lec.title}</strong>
                        <br />
                        {lec.course_id}-{lec.sec_id}
                        <br />
                        {lec.professor}
                        <br />
                        {lec.building} {lec.room_number}
                      </div>
                    </td>
                  );
                } else {
                  // 비어 있는 셀
                  return (
                    <td
                      key={day}
                      style={{
                        minWidth: '120px',
                        verticalAlign: 'top'
                      }}
                    ></td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
