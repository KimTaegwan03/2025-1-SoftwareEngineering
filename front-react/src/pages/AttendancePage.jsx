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
    <div className="min-h-screen flex flex-col items-center" style={{backgroundColor: '#FFF8F5'}}>
    <h1 className="text-2xl font-bold m-4">출석 체크</h1>
    <button onClick={() => navigate('/instructor/lectures')} style={{ marginBottom: '1rem' }}>
    ← 강의 목록으로 돌아가기
    </button>
    <div className="w-full bg-white rounded shadow"
     style={{ maxWidth: '40%', border: '1px solid #ccc', paddingTop: '1rem', margin: '1rem 0' }}>
      <label style={{ marginLeft: '1rem', marginBottom: '1rem', padding:"0.5rem"}}>날짜: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
      <div style={{ marginTop: '1rem',  marginLeft: '1rem', marginBottom: '1rem', padding:"0.5rem" }}>
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
            className="bg-red-700 hover:bg-red-800 text-white font-semibold rounded"
            style= {{ marginRight: '0.5rem', padding: '0.5rem', paddingTop: '0.3rem', paddingBottom: '0.3rem' }}
            >
            전체 {status}
            </button>
        ))}
        </div>
        </div>
        <div className="w-full bg-white rounded shadow"
     style={{ maxWidth: '40%', border: '1px solid #ccc', paddingTop: '1rem', margin: '1rem 0' }}>
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
            <th style={{textAlign: "center", padding:'.3rem'}}>출석 상태</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={`${s.studentId}-${attendance[s.studentId] || 'none'}`}>
              <td style={{padding:'.5rem', textAlign:'center'}}>{String(s.studentId).padStart(8, '0')}</td>
              <td style={{padding:'.5rem', textAlign:'center'}}>{s.name}</td>
              <td style={{padding:'.5rem', textAlign:'center'}}>
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
      <button onClick={handleSubmit} className="bg-red-700 hover:bg-red-800 text-white font-semibold rounded" style={{ marginLeft: '1rem', marginBottom: '1rem', padding:"0.5rem",  paddingTop: '0.3rem', paddingBottom: '0.3rem'}}>출석 저장</button>
      {message && <p style={{ marginLeft: '1rem', marginBottom: '1rem', padding:"0.5rem"}}>{message}</p>}
    </div>
    </div>
  );
}

export default AttendancePage;
