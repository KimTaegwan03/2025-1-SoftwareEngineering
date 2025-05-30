import { useEffect, useState } from 'react';
import './Home.css';

function Home() {
  const [student, setStudent] = useState(null);
  const [credits, setCredits] = useState(null);
  const [notices, setNotices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [filters, setFilters] = useState({
    year: '2025',
    semester: '1학기',
    course: '',
    professor: '',
    enrolledOnly: true
  });

  const dayToCol = { '월': 2, '화': 3, '수': 4, '목': 5, '금': 6 };
  const timeToRow = {
    '09:00': 1,
    '10:30': 2,
    '12:00': 3,
    '13:30': 4,
    '15:00': 5,
    '16:30': 6,
    '18:00': 7
  };


  // 1. 학생 정보
  useEffect(() => {
    fetch('http://localhost:3000/auth/mypage', { credentials: 'include' })
      .then(res => res.json())
      .then(setStudent);
  }, []);

  // 2. 학점 정보
  useEffect(() => {
    fetch('http://localhost:3000/grade/gradCreds', { credentials: 'include' })
      .then(res => res.json())
      .then(setCredits);
  }, []);

  // // 3. 공지사항
  // useEffect(() => {
  //   fetch('http://localhost:3000/notice/all', { credentials: 'include' })
  //     .then(res => res.json())
  //     .then(data => setNotices(data.slice(0, 3)));
  // }, []);

  // // 4. 강의평가
  // useEffect(() => {
  //   fetch('http://localhost:3000/lecture/review', { credentials: 'include' })
  //     .then(res => res.json())
  //     .then(data => setReviews(data.slice(0, 3)));
  // }, []);

  // 5. 시간표
  useEffect(() => {
    fetch('http://localhost:3000/lecture/student/timetable', { credentials: 'include' })
      .then(res => res.json())
      .then(setTimetable);

      console.log(timetable);
  }, []);

  // 6. 강의계획서 조회 (필요 시 버튼 클릭으로 fetch)
  const handleSearch = () => {
    const query = new URLSearchParams({
      year: filters.year,
      semester: filters.semester,
      enrolledOnly: filters.enrolledOnly,
      course: filters.course,
      professor: filters.professor
    }).toString();

    fetch(`http://localhost:3000/syllabus/${query}`, {
      credentials: 'include'
    }).then(res => res.json()).then(data => console.log(data));
  };

  return (
    <div className="home-container">

      <main className="home-grid">

        {/* 1. 프로필 카드 */}
        <section className="profile-card">
          {student && (
            <>
              <div className="profile-pic"></div>
              <div className="profile-info">
                <strong>{student.name}</strong>
                <div>{String(student.id).padStart(10, '0')}</div>
                <div>{student.dept_name}</div>
              </div>
            </>
          )}
        </section>

        {/* 2. 취득 학점 */}
        <section className="credit-summary">
          {credits && (
            <>
              <h4>남은 학점</h4>
              <div><b>{credits.totalCredits}/{credits.gradCreds}</b></div>
            </>
          )}
        </section>

        {/* 3. 강의계획서 */}
        <section className="lecture-plan">
          <h3>강의계획서</h3>
          <div className="filters">
            <select value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}>
              <option>2025</option><option>2024</option>
            </select>
            <select value={filters.semester} onChange={e => setFilters(f => ({ ...f, semester: e.target.value }))}>
              <option>1학기</option><option>2학기</option>
            </select>
            <label>
              <input
                type="checkbox"
                checked={filters.enrolledOnly}
                onChange={e => setFilters(f => ({ ...f, enrolledOnly: e.target.checked }))}
              /> 수강 여부
            </label>
            <input
              placeholder="과목명"
              value={filters.course}
              onChange={e => setFilters(f => ({ ...f, course: e.target.value }))}
            />
            <input
              placeholder="교수명"
              value={filters.professor}
              onChange={e => setFilters(f => ({ ...f, professor: e.target.value }))}
            />
            <button onClick={handleSearch}>조회</button>
          </div>
        </section>

        {/* 4. 시간표 */}
        <section className="schedule">
          <h3>수업 시간표</h3>
          <div className="schedule-grid">
  {timetable.map((cls, idx) => {
    const startRow = timeToRow[cls.scheduleTimes.start];
    const endRow = timeToRow[cls.scheduleTimes.end] + 1;
    const col = dayToCol[cls.scheduleDay];

    return (
      <div
        key={idx}
        className="class"
        style={{ gridRow: `${startRow}/${endRow-1}`, gridColumn: col }}
      >
        {cls.title}
        <br />
        <small>{cls.building} {cls.roomNumber}</small>
      </div>
    );
  })}
</div>
        </section>

        {/* 5. 공지사항 */}
        <section className="notice">
          <h3>전체공지</h3>
          {/* <ul>
            {notices.map((n, idx) => (
              <li key={idx}>
                <strong>{n.date}</strong><br />{n.content}
              </li>
            ))}
          </ul> */}
        </section>

        {/* 6. 강의평가 */}
        <section className="review">
          <h3>강의평가</h3>
          {/* <ul>
            {reviews.map((r, idx) => (
              <li key={idx}>
                <strong>{r.course}: {r.professor}</strong><br />{r.comment}
              </li>
            ))}
          </ul> */}
        </section>
      </main>
    </div>
  );
};

export default Home;
