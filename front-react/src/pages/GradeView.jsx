import { useEffect, useState } from 'react';
import StudentGradeChart from './StudentGradeChart';

function StudentGrades() {
  const [groupedGrades, setGroupedGrades] = useState({});
  const [totalCredits, setTotalCredits] = useState(null);
  const [gradCreds, setGradCred] = useState(null);
  const [loading, setLoading] = useState(true);

  const gradeToPoint = {
  'A+': 4.5, 'A': 4.0,
  'B+': 3.5, 'B': 3.0,
  'C+': 2.5, 'C': 2.0,
  'D+': 1.5, 'D': 1.0,
  'F': 0.0
  };

  useEffect(() => {
    fetch('http://localhost:3000/grade/student', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        // 학기별로 그룹화
        const grouped = {};
        data.forEach(g => {
          const key = `${g.year}년 ${g.semester}학기`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(g);
        });
        setGroupedGrades(grouped);
      });

      // 졸업 기준 학점 조회
    fetch('http://localhost:3000/grade/gradCreds', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setTotalCredits(data.totalCredits);
        setGradCred(data.gradCreds);
      })
      .finally(() => setLoading(false));
  }, []);


  if (loading) return <p>불러오는 중...</p>;

  const remaining = gradCreds !== null && totalCredits !== null
    ? Math.max(gradCreds - totalCredits, 0)
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{backgroundColor: '#FFF8F5'}}>
      <h1 className="text-2xl font-bold m-4">성적 조회</h1>
      <div  className="w-full bg-white rounded shadow" style={{maxWidth: '40%', border: '1px solid #ccc', paddingTop: '1rem', margin: '1rem 0'}}>
        <StudentGradeChart />
      </div>
      <div className="w-full bg-white rounded shadow"
     style={{ maxWidth: '40%', border: '1px solid #ccc', paddingTop: '1rem', margin: '1rem 0' }}>
  <h3 style={{fontWeight: 'bold', paddingLeft:"1rem"}}>학기별 성적 요약</h3>
  <table style={{
                          // boxShadow: "0 2px 5px rgba(0,0,0,.25)",
                          width: "95%",
                          borderCollapse: "collapse",
                          border: "1px solid #ccc",
                          overflow: "hidden",
                          margin: "1rem auto"}}>
    <thead style={{fontWeight: "bold", color: "#fff", backgroundColor: "#8A1601"}}>
      <tr>
        <th style={{textAlign: "center", padding:'.3rem'}}>학기</th>
        <th style={{textAlign: "center", padding:'.3rem'}}>이수학점</th>
        <th style={{textAlign: "center", padding:'.3rem'}}>평점</th>
        <th style={{textAlign: "center", padding:'.3rem'}}>누적 평점</th>
      </tr>
    </thead>
    <tbody>
      {(() => {
        let cumPoints = 0;
        let cumCredits = 0;

        return Object.entries(groupedGrades).map(([semesterLabel, grades], idx) => {
          const total = grades.reduce((acc, g) => {
            const point = gradeToPoint[g.grade] ?? null;
            if (point !== null) {
              acc.points += point * g.credit;
              acc.credits += g.credit;
            }
            return acc;
          }, { points: 0, credits: 0 });

          const gpa = total.credits > 0 ? (total.points / total.credits).toFixed(2) : 'N/A';
          cumPoints += total.points;
          cumCredits += total.credits;
          const cumulativeGPA = cumCredits > 0 ? (cumPoints / cumCredits).toFixed(2) : 'N/A';

          return (
            <tr key={semesterLabel}>
              <td style={{padding:'.5rem', textAlign:'center'}}>{semesterLabel}</td>
              <td style={{padding:'.5rem', textAlign:'center'}}>{total.credits}</td>
              <td style={{padding:'.5rem', textAlign:'center'}}>{gpa}</td>
              <td style={{padding:'.5rem', textAlign:'center'}}>{cumulativeGPA}</td>
            </tr>
          );
        });
      })()}
    </tbody>
  </table>
</div>

      <div  className="w-full bg-white rounded shadow" style={{maxWidth: '40%', border: '1px solid #ccc', margin: '1rem 0'}}>
        {remaining !== null && (
        <div style={{ padding: '2rem', fontWeight: 'bold', color: remaining === 0 ? 'green' : 'black' }}>
          졸업까지 남은 학점: {remaining}학점 ({totalCredits} / {gradCreds})
        </div>
        )}
        </div>
        <div className="w-full bg-white rounded shadow" style={{maxWidth: '40%', border: '1px solid #ccc', margin: '1rem 0'}}>
        <h3 style={{fontWeight: 'bold', paddingLeft:"1rem", paddingTop:"1rem"}}>학기별 세부 성적</h3>
        {Object.entries(groupedGrades).map(([semesterLabel, grades]) => (
            <div key={semesterLabel} style={{ margin:'auto' }}>
            <table style={{
                          // boxShadow: "0 2px 5px rgba(0,0,0,.25)",
                          width: "95%",
                          borderCollapse: "collapse",
                          border: "1px solid #ccc",
                          overflow: "hidden",
                          margin: "1rem auto"}}>
                <thead style={{fontWeight: "bold", color: "#fff", backgroundColor: "#8A1601"}}>
                <tr>
                    <th colSpan="4" style={{textAlign: "center", padding:'.3rem'}}>{semesterLabel}</th>
                </tr>
                <tr>
                    <th style={{textAlign: "center", padding:'.3rem'}}>과목명</th>
                    <th style={{textAlign: "center", padding:'.3rem'}}>과목코드</th>
                    <th style={{textAlign: "center", padding:'.3rem'}}>학점</th>
                    <th style={{textAlign: "center", padding:'.3rem'}}>성적</th>
                </tr>
                </thead>
                <tbody>
                {grades.map((g, idx) => (
                    <tr key={idx}>
                      <td style={{padding:'.5rem', textAlign:'left'}}>{g.lectureTitle}</td>
                      <td style={{padding:'.5rem', textAlign:'center'}}>{g.courseId}</td>
                      <td style={{padding:'.5rem', textAlign:'center'}}>{g.credit}</td>
                      <td style={{padding:'.5rem', textAlign:'center'}}>{g.grade ?? '미입력'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        ))}
        </div>
    </div>
  );
}

export default StudentGrades;
