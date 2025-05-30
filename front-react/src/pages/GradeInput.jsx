import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function GradeInput() {
  const { lectureId } = useParams(); // ✅ URL에서 lectureId 직접 추출
  const [grades, setGrades] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // 컴포넌트 내부에서 선언

  useEffect(() => {
    fetch(`http://localhost:3000/grade/lecture/${lectureId}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setGrades(data));
  }, [lectureId]);

  const handleChange = (studentId, value) => {
    setGrades(grades.map(g =>
      g.studentId === studentId ? { ...g, grade: value } : g
    ));
  };

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:3000/grade/lecture/${lectureId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ grades })
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div>
      <button onClick={() => navigate('/instructor/lectures')} style={{ marginBottom: '1rem' }}>
      ← 강의 목록으로 돌아가기
      </button>
      <h2>성적 입력</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>학번</th>
            <th>이름</th>
            <th>성적</th>
          </tr>
        </thead>
        <tbody>
          {grades.map(g => (
            <tr key={g.studentId}>
              <td>{String(g.studentId).padStart(8, '0')}</td>
              <td>{g.name}</td>
              <td>
                <select
                  value={g.grade || ''}
                  onChange={e => handleChange(g.studentId, e.target.value)}
                >
                  <option value="">선택</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="D+">D+</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>성적 저장</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default GradeInput;
