import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function GradeInput() {
  const { lectureId } = useParams(); // ✅ URL에서 lectureId 직접 추출
  const [grades, setGrades] = useState([]);
  const [message, setMessage] = useState('');

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
                <input
                  value={g.grade || ''}
                  onChange={e => handleChange(g.studentId, e.target.value)}
                />
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
