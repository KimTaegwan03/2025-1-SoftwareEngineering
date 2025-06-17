import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const gradeToPoint = {
  'A+': 4.5,
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D+': 1.5,
  'D': 1.0,
  'F': 0.0
};

function StudentGradeChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/grade/student', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        // 학기별로 성적을 그룹화하고 평균 계산
        const grouped = {};
        data.forEach(g => {
          const key = `${g.year}년 ${g.semester}학기`;
          if (!grouped[key]) grouped[key] = [];
          if (g.grade && gradeToPoint[g.grade]) {
            grouped[key].push(gradeToPoint[g.grade]);
          }
        });

        const averaged = Object.entries(grouped).map(([semester, scores]) => ({
          semester,
          average: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
        }));

        setChartData(averaged);
      });
  }, []);

  return (
    <div>
      <h3 style={{fontWeight: 'bold', paddingLeft:"1rem", marginBottom: "1rem"}}>학기별 성적</h3>
    <div style={{ width: '70%', height: 300, margin: 'auto', marginBottom: '2rem' }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="semester" />
          <YAxis domain={[0, 4.5]} />
          <Tooltip />
          <Line dataKey="average" fill="#8884d8" name="성적" />
        </LineChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
}

export default StudentGradeChart;
