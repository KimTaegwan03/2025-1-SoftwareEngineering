import { useEffect, useState } from 'react';
import StudentGradeChart from './StudentGradeChart';

function StudentGrades() {
  const [groupedGrades, setGroupedGrades] = useState({});
  const [loading, setLoading] = useState(true);

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
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>불러오는 중...</p>;

  return (
    <>
        <StudentGradeChart />
        <div style={{ padding: '2rem' }}>
        <h2>성적 조회</h2>
        {Object.entries(groupedGrades).map(([semesterLabel, grades]) => (
            <div key={semesterLabel} style={{ marginBottom: '2rem' }}>
            <h3>{semesterLabel}</h3>
            <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th>과목명</th>
                    <th>과목코드</th>
                    <th>성적</th>
                </tr>
                </thead>
                <tbody>
                {grades.map((g, idx) => (
                    <tr key={idx}>
                    <td>{g.lectureTitle}</td>
                    <td>{g.courseId}</td>
                    <td>{g.grade ?? '미입력'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        ))}
        </div>
    </>
  );
}

export default StudentGrades;
