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
    <div style={{ padding: '2rem' }}>
      <h2>내 강의 목록</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={sortByYear}>년도 정렬 {sortYearAsc ? '▲' : '▼'}</button>{' '}
        <button onClick={sortBySemester}>학기 정렬 {sortSemesterAsc ? '▲' : '▼'}</button>
      </div>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '60%' }}>
        <thead>
          <tr>
            <th>강의명</th>
            <th>학기</th>
            <th>년도</th>
            <th>출석 체크</th>
            <th>공지 보기</th>
          </tr>
        </thead>
        <tbody>
          {sortedLectures.map(lecture => (
            <tr key={lecture.id}>
              <td
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => navigate(`/gradeinput/${lecture.id}`)}
              >
                {lecture.title}
              </td>
              <td>{lecture.semester}</td>
              <td>{lecture.year}</td>
              <td>
                <button onClick={() => navigate(`/attendance/${lecture.id}`)}>입력</button>
              </td>
              <td>
                <button onClick={() => navigate(`/announcements/${lecture.id}`)}>이동</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InstLecture;
