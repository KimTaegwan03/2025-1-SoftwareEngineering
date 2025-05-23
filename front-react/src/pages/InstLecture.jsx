import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InstLecture() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/lecture/instructor', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setLectures(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>내 강의 목록</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>강의명</th>
            <th>과목 코드</th>
            <th>학기</th>
            <th>년도</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map(lecture => (
            <tr key={lecture.ID}>
              <td
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => navigate(`/gradeinput/${lecture.ID}`)}
              >
                {lecture.title}
              </td>
              <td>{lecture.course_id}</td>
              <td>{lecture.semester}</td>
              <td>{lecture.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InstLecture;
