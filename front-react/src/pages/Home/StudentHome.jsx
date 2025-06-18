import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './Home.css';
import Timetable from '@/pages/Timetable';
//function Home() {
   //const navigate = useNavigate();

import './StudentHome.css';

function StudentHome() {
  const navigate = useNavigate();  
  const [student, setStudent] = useState(null);
  const [credits, setCredits] = useState(null);
  const [notices, setNotices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    year: '2025',
    semester: '1학기',
    course: '',
    professor: ''
    
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
   // 6. 강의계획서 조회: lecture/list → 필터링 → 결과 세팅
 const handleSearch = () => {
   fetch('http://localhost:3000/lecture/list', { credentials: 'include' })
     .then(res => res.json())
     .then(data => {
       // client-side filter
       const filtered = data.filter(lec => {
         const matchYear     = lec.year.toString() === filters.year;
         const matchSem      = filters.semester === '1학기'
                             ? lec.semester === 1
                             : lec.semester === 2;
         const matchCourse   = lec.title.includes(filters.course);
         const matchProf     = lec.professor.includes(filters.professor);
        
         return matchYear && matchSem && matchCourse && matchProf;
       });
       
       setSearchResults(filtered);
     })
     .catch(err => console.error('강의 목록 조회 실패:', err));
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

        {/* 3. 강의계획서 검색/리스트 */}
<section className="lecture-plan">
  <h3>강의계획서</h3>
  <div className="filters">
    <select
      value={filters.year}
      onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
    >
      <option>2025</option>
      <option>2024</option>
    </select>
    <select
      value={filters.semester}
      onChange={e => setFilters(f => ({ ...f, semester: e.target.value }))}
    >
      <option>1학기</option>
      <option>2학기</option>
    </select>
    
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

  {/* ─── 검색 결과 보여주기 ─── */}
  {searchResults.length > 0 ? (
    <ul className="search-results" style={{ marginTop: 16 }}>
      {searchResults.map(lec => (
        <li
          key={lec.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0',
            borderBottom: '1px solid #eee'
          }}
        >
          <span>
            <strong>{lec.title}</strong> — {lec.professor} (
            {lec.year}년 {lec.semester}학기)
          </span>
          <button
            onClick={() => navigate(`/syllabus/${lec.id}`)}
            style={{
              background: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.75rem',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            계획서 보기
          </button>
        </li>
      ))}
    </ul>
  ) : (
    // 첫 조회 전이나, 결과가 없을 때 메시지
    <p style={{ marginTop: 16, color: '#888' }}>
      조회된 강의가 없습니다.
    </p>
  )}
</section>



<section
        className="schedule"
          onClick={() => navigate('/timetable')}
         style={{ cursor: 'pointer' }}
       >
         <h3>
          수업 시간표 (미리보기)&nbsp;
           <span style={{ color: '#555', fontSize: '0.85rem' }}>
             (클릭하면 전체 시간표 보기)
           </span>
         </h3>
         <div style={{ overflowX: 'auto' }}>
           <Timetable preview={true} />
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

       {/* 6. 강의평가 (클릭하면 리뷰 목록으로 이동) */}
        <section
          className="review"
          onClick={() => navigate('/reviews')}
          style={{ cursor: 'pointer', padding: '1rem', border: '1px solid #eee', borderRadius: 4 }}
        >
          <h3>강의평가</h3>
          <p>▶ 내 강의 리뷰 보러가기</p>
        </section>
      </main>
    </div>
  );
};

export default StudentHome;
