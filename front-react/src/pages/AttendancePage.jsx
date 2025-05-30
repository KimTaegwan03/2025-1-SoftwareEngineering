import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AttendancePage() {
  const { lectureId } = useParams();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // 컴포넌트 내부에서 선언

  useEffect(() => {
    fetch(`http://localhost:3000/lecture/attendance/${lectureId}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setStudents(data));
  }, [lectureId]);

  // 날짜에 따른 출석 데이터 불러오기
  useEffect(() => {
    fetch(`http://localhost:3000/lecture/attendance/${lectureId}?date=${date}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(record => {
          map[record.studentId] = record.status;
        });
        setAttendance(map);
      });
  }, [lectureId, date]);

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
    <button onClick={() => navigate('/instructor/lectures')} style={{ marginBottom: '1rem' }}>
    ← 강의 목록으로 돌아가기
    </button>
      <h2>출석 체크</h2>
      <label>날짜: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
      <div style={{ marginTop: '1rem' }}>
        <strong>전체 설정: </strong>
        {['출석', '지각', '결석'].map((status) => (
            <button
            key={status}
            onClick={() => {
                const updated = {};
                students.forEach(s => {
                updated[s.studentId] = status;
                });
                setAttendance(updated);
            }}
            style={{ marginRight: '0.5rem' }}
            >
            전체 {status}
            </button>
        ))}
        </div>
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
            <tr key={`${s.studentId}-${attendance[s.studentId] || 'none'}`}>
              <td>{String(s.studentId).padStart(8, '0')}</td>
              <td>{s.name}</td>
              <td>
                <div>
                    {['출석', '지각', '결석'].map((status) => (
                        <label key={status} style={{ marginRight: '0.5rem' }}>
                        <input
                            type="radio"
                            name={`status-${s.studentId}`} // 각 학생별 그룹
                            value={status}
                            checked={attendance[s.studentId] === status}
                            onChange={(e) => handleChange(s.studentId, e.target.value)}
                        />
                        {status}
                        </label>
                    ))}
                    </div>

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
