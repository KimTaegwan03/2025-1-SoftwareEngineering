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
    <div className="min-h-screen flex flex-col items-center" style={{backgroundColor: '#FFF8F5'}}>
      <h1 className="text-2xl font-bold m-4">성적 입력</h1>
      <button onClick={() => navigate('/instructor/lectures')} style={{ marginBottom: '1rem' }}>
      ← 강의 목록으로 돌아가기
      </button>
      <div  className="w-full bg-white rounded shadow" style={{maxWidth: '35%', border: '1px solid #ccc', paddingTop: '1rem', margin: '1rem 0'}}>
      <table style={{
                          // boxShadow: "0 2px 5px rgba(0,0,0,.25)",
                          width: "95%",
                          borderCollapse: "collapse",
                          border: "1px solid #ccc",
                          overflow: "hidden",
                          margin: "1rem auto"}}>
        <thead style={{fontWeight: "bold", color: "#fff", backgroundColor: "#8A1601"}}>
          <tr>
            <th style={{textAlign: "center", padding:'.3rem'}}>학번</th>
            <th style={{textAlign: "center", padding:'.3rem'}}>이름</th>
            <th style={{textAlign: "center", padding:'.3rem'}}>성적</th>
          </tr>
        </thead>
        <tbody>
          {grades.map(g => (
            <tr key={g.studentId}>
              <td style={{padding:'.5rem', textAlign:'left'}}>{String(g.studentId).padStart(8, '0')}</td>
              <td style={{padding:'.5rem', textAlign:'left'}}>{g.name}</td>
              <td style={{padding:'.5rem', textAlign:'left'}}>
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
      <button onClick={handleSubmit} className="bg-red-700 hover:bg-red-800 text-white font-semibold rounded" style={{ marginLeft: '1rem', marginBottom: '1rem', padding:"0.5rem",  paddingTop: '0.3rem', paddingBottom: '0.3rem'}}>성적 저장</button>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
}

export default GradeInput;
