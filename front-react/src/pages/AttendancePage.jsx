import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function AttendancePage() {
  const { lectureId } = useParams();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/lecture/attendance/${lectureId}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setStudents(data));
  }, [lectureId]);

  const handleChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const handleSubmit = async () => {
    const body = {
      date,
      attendance: students.map(s => ({
        studentId: s.studentId,
        status: attendance[s.studentId] || '결석'
      }))
    };

    const res = await fetch(`http://localhost:3000/lecture/attendance/${lectureId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>출석 체크</h2>
      <label>날짜: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>학번</th>
            <th>이름</th>
            <th>출석 상태</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.studentId}>
              <td>{String(s.studentId).padStart(8, '0')}</td>
              <td>{s.name}</td>
              <td>
                <select onChange={e => handleChange(s.studentId, e.target.value)} defaultValue="출석">
                  <option value="출석">출석</option>
                  <option value="지각">지각</option>
                  <option value="결석">결석</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit} style={{ marginTop: '1rem' }}>출석 저장</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AttendancePage;
