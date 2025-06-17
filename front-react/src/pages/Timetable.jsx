// src/pages/Timetable.jsx
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';

const days = ['월', '화', '수', '목', '금'];
const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const PALETTE = [
  '#FFB3BA', '#FFDFBA', '#FFFFBA',
  '#BAFFC9', '#BAE1FF', '#D7BAFF',
  '#FFBAED', '#B0E0E6', '#FFDAB9'
];

const Timetable = () => {
  const { student } = useContext(UserContext);
  const [timetable, setTimetable] = useState({});
  const [colorMap, setColorMap] = useState({});

  if (!student) {
    return (
      <div className="text-center text-lg p-4">
        로그인 정보를 불러오는 중입니다...
      </div>
    );
  }

  const studentId = student.id;

  useEffect(() => {
    if (!studentId) return;

    fetch(`http://localhost:3000/enroll/enrollments/${studentId}`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('시간표 조회 중 오류 발생');
        return res.json();
      })
      .then(data => {
        // 1) 그리드 초기화
        const grid = {};
        days.forEach(day => {
          grid[day] = Array(periods.length).fill('');
        });

        // 2) 강의별 고유 색상 맵 생성
        const unique = {};
        data.forEach(enr => {
          const lec = enr.Lecture;
          if (lec && lec.id != null) unique[lec.id] = lec;
        });
        const newColorMap = {};
        Object.keys(unique).forEach((id, idx) => {
          newColorMap[id] = PALETTE[idx % PALETTE.length];
        });
        setColorMap(newColorMap);

        // 3) 그리드에 채우기
        data.forEach(enr => {
          const lec = enr.Lecture;
          if (!lec || !Array.isArray(lec.scheduleTimes)) return;
          lec.scheduleTimes.forEach(t => {
            const col = lec.scheduleDay;
            const rowIdx = t - 1;
            if (grid[col] && rowIdx >= 0 && rowIdx < periods.length) {
              grid[col][rowIdx] = lec;
            }
          });
        });

        setTimetable(grid);
      })
      .catch(err => console.error('❌ 시간표 불러오기 실패:', err));
  }, [studentId]);

  return (
    <div className="min-h-screen bg-[#FFF8F5] p-6">
      <h2 className="text-3xl font-bold text-[#8A1601] text-center mb-6">
        내 시간표
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-[#8A1601]">
          <thead>
            <tr className="bg-[#8A1601] text-white">
              <th className="py-2 px-4 border border-[#8A1601]">교시</th>
              {days.map(day => (
                <th
                  key={day}
                  className="py-2 px-4 border border-[#8A1601]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map(period => (
              <tr key={period} className="bg-white even:bg-[#FDF1EB]">
                <td className="py-2 px-3 font-semibold text-center border border-[#8A1601] bg-[#FBE9E7] text-[#8A1601]">
                  {period}교시
                </td>
                {days.map(day => {
                  const lec = timetable[day]?.[period - 1];
                  if (lec && lec.id) {
                    const bgColor = colorMap[lec.id] || '#ccc';
                    return (
                      <td
                        key={day}
                        className="h-28 min-w-[120px] align-top border border-[#8A1601]"
                        style={{ backgroundColor: bgColor }}
                      >
                        <Link
                          to={`/lecture/${lec.id}`}
                          className="block h-full w-full px-1 py-0.5 cursor-pointer text-sm"
                        >
                          <strong>{lec.title}</strong><br/>
                          {lec.course_id}-{lec.sec_id}<br/>
                          {lec.professor}<br/>
                          {lec.building} {lec.room_number}
                        </Link>
                      </td>
                    );
                  } else {
                    return (
                      <td
                        key={day}
                        className="py-4 px-2 border border-[#8A1601]"
                      />
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
