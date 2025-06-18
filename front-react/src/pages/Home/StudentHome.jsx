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
  const [announcements, setAnnouncements] = useState([]);
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

  // 3. 공지사항
  useEffect(() => {
    fetch('http://localhost:3000/announcement/all', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setAnnouncements(data));
  }, []);

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

  const utc2ko = (utcDateString) => {
    const utcDate = new Date(utcDateString);

    // 방법 1: Intl.DateTimeFormat 사용 (권장)
    // 가장 정확하고 로케일 기반의 포맷팅 제공
    const kstDateFormatter = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const kstFormattedDate = kstDateFormatter.format(utcDate);
    console.log(`한국 시간 (Intl.DateTimeFormat): ${kstFormattedDate}`); // 예: 2023. 10. 27.

    // 방법 2: getFullYear(), getMonth(), getDate() 사용 (수동 계산)
    // UTC 시간에 9시간을 더해 KST로 변환 (한국은 UTC+9)
    const kstTime = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000)); // 9시간 * 60분 * 60초 * 1000밀리초

    const year = kstTime.getFullYear();
    const month = String(kstTime.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1, 두 자리로 포맷팅
    const day = String(kstTime.getDate()).padStart(2, '0');     // 두 자리로 포맷팅

    return `${year}-${month}-${day}`;
  }

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
        >
          <div style={{ overflowX: 'auto' }}>
            <Timetable preview={true} />
          </div>
        </section>


        <section className="notice">
          <h3>과목별 NOTICE</h3>
          <ul>
            {announcements.map((announcement, idx) => (
              <li 
                key={announcement.id || idx} 
                className="flex items-center py-4 border-b cursor-pointer" // justify-between 제거
                onClick={() => navigate(`/announcement/${announcement.lecture.id}/${announcement.id}`)}
              >
                {/* 왼쪽 영역: 너비를 3/5 (60%)으로 지정 */}
                <div className="w-3/5"> 
                  <span>{utc2ko(announcement.updatedAt) + ' 강의 공지사항 >'}</span>
                  <strong className="ml-4">{announcement.lecture ? announcement.lecture.title : '강의명 없음'}</strong>
                </div>

                {/* 오른쪽 영역: 너비를 2/5 (40%)로 지정 */}
                <span className="w-2/5">
                  {announcement.title}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default StudentHome;
