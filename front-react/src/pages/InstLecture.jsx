import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InstLecture() {
  const [lectures, setLectures] = useState([]);
  const [sortedLectures, setSortedLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortYearAsc, setSortYearAsc] = useState(true);
  const [sortSemesterAsc, setSortSemesterAsc] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/lecture/instructor', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setLectures(data);
        setSortedLectures(data); // 초기 정렬값
      })
      .finally(() => setLoading(false));
  }, []);

  const sortByYear = () => {
    const sorted = [...sortedLectures].sort((a, b) =>
      sortYearAsc ? a.year - b.year : b.year - a.year
    );
    setSortedLectures(sorted);
    setSortYearAsc(!sortYearAsc);
  };

  const sortBySemester = () => {
    const semOrder = { '1': 1, '2': 2 };
    const sorted = [...sortedLectures].sort((a, b) =>
      sortSemesterAsc
        ? semOrder[a.semester] - semOrder[b.semester]
        : semOrder[b.semester] - semOrder[a.semester]
    );
    setSortedLectures(sorted);
    setSortSemesterAsc(!sortSemesterAsc);
  };

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center" style={{backgroundColor: '#FFF8F5'}}>
      <h1 className="text-2xl font-bold m-4">강의 목록</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={sortByYear}>년도 정렬 {sortYearAsc ? '▲' : '▼'}</button>{' '}
        <button onClick={sortBySemester}>학기 정렬 {sortSemesterAsc ? '▲' : '▼'}</button>
      </div>
      <div  className="w-full bg-white rounded shadow" style={{maxWidth: '60%', border: '1px solid #ccc', paddingTop: '1rem', margin: '1rem 0'}}>
      <table style={{
                          // boxShadow: "0 2px 5px rgba(0,0,0,.25)",
                          width: "95%",
                          borderCollapse: "collapse",
                          border: "1px solid #ccc",
                          overflow: "hidden",
                          margin: "1rem auto"}}>
        <thead style={{fontWeight: "bold", color: "#fff", backgroundColor: "#8A1601"}}>
          <tr>
            <th style={{textAlign: "center", padding:'.3rem'}}>강의명</th>
            <th style={{textAlign: "center", padding:'.3rem'}}>학기</th>
            <th style={{textAlign: "center", padding:'.3rem'}}>년도</th>
            <th style={{textAlign: "center", padding:'.3rem'}}>성적 입력</th>
            <th style={{textAlign: "center", padding:'.3rem'}}>출석 체크</th>
            <th style={{textAlign: "center", padding:'.3rem'}}>공지 보기</th>
            <th style={{textAlign: "center", padding:'.3rem'}}>과제 보기</th>
            <th style={{textAlign: "center", padding:'.3rem'}}>Q&A 보기</th>
            <th style={{textAlign: "center", padding:'.3rem'}}>통계 보기</th>
          </tr>
        </thead>
        <tbody>
          {sortedLectures.map(lecture => (
            <tr key={lecture.id}>
              <td style={{padding:'.5rem', textAlign:'center'}}>
                {lecture.title}
              </td>
              <td style={{padding:'.5rem', textAlign:'center'}}>{lecture.semester}</td>
              <td style={{padding:'.5rem', textAlign:'center'}}>{lecture.year}</td>
              <td style={{padding:'.5rem', textAlign:'center'}}>
                <button onClick={() => navigate(`/gradeinput/${lecture.id}`)}>이동</button>
              </td>
              <td style={{padding:'.5rem', textAlign:'center'}}>
                <button onClick={() => navigate(`/attendance/${lecture.id}`)}>이동</button>
              </td>
              <td style={{padding:'.5rem', textAlign:'center'}}>
                <button onClick={() => navigate(`/announcements/${lecture.id}`)}>이동</button>
              </td>
              <td style={{padding:'.5rem', textAlign:'center'}}>
                <button onClick={() => navigate(`/assignments/${lecture.id}`)}>이동</button>
              </td>
              <td style={{padding:'.5rem', textAlign:'center'}}>
                <button onClick={() => navigate(`/questions/${lecture.id}`)}>이동</button>
              </td>
              <td style={{padding:'.5rem', textAlign:'center'}}>
                <button onClick={() => navigate(`/instructor/lectures/${lecture.id}/stats`)}>이동</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default InstLecture;
