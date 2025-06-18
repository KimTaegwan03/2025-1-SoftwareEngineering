import { React, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InstructorContext } from '@/InstructorContext';
import './StudentHome.css';

const days = ['월', '화', '수', '목', '금'];
const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const PALETTE = [
  '#FFB3BA', '#FFDFBA', '#FFFFBA',
  '#BAFFC9', '#BAE1FF', '#D7BAFF',
  '#FFBAED', '#B0E0E6', '#FFDAB9'
];

export default function InstructorHome() {
  const { instructor } = useContext(InstructorContext);
  const [lectures, setLectures] = useState([]);
  const [colorMap, setColorMap] = useState({});

  useEffect(() => {
    if (!instructor) return;
    fetch('http://localhost:3000/lecture/instructor', {
      credentials: 'include',
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        setLectures(data);
        const map = {};
        data.forEach((lec, i) => {
          map[lec.id] = PALETTE[i % PALETTE.length];
        });
        setColorMap(map);
      })
      .catch(console.error);
  }, [instructor]);

  const grid = {};
  days.forEach(d => (grid[d] = Array(periods.length).fill(null)));
  lectures.forEach(lec => {
    lec.scheduleTimes.forEach(t => {
      const day = lec.scheduleDay;
      const idx = t - 1;
      if (grid[day] && idx >= 0 && idx < periods.length) {
        grid[day][idx] = lec;
      }
    });
  });

  return (
    <div className="home-container">
      <main className="home-grid">
        {/* 1. 프로필 카드 */}
        <section className="profile-card">
          <div className="profile-info">
             <div className="profile-icon">👤</div>
            <strong>{instructor?.name} 교수님</strong>
            <div>{instructor?.dept_name}</div>
          </div>
        </section>

        {/* 2. 강의 시간표 카드 */}
        <section className="timetable-card">
          <h3>📅 내 강의 시간표</h3>
          <div className="timetable-wrapper">
            <table>
              <thead>
                <tr>
                  <th>교시</th>
                  {days.map(d => (
                    <th key={d}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map(p => (
                  <tr key={p}>
                    <td className="period-label">{p}교시</td>
                    {days.map(d => {
                      const lec = grid[d][p - 1];
                      return (
                        <td
                          key={d}
                          className="lec-cell"
                          style={{
                            backgroundColor: lec ? colorMap[lec.id] : 'transparent'
                          }}
                        >
                          {lec && (
                            <div className="lec-info">
                              <strong>{lec.title}</strong><br />
                              {lec.sec_id}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
