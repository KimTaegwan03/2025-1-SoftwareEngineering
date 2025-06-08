// src/pages/LectureStats.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { InstructorContext } from '../InstructorContext';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

// 파이차트 색상 배열 (필요에 따라 늘리거나 수정하세요)
const PIE_COLORS = [
  '#FF8A80',
  '#FFD180',
  '#FFFF8D',
  '#CCFF90',
  '#80D8FF',
  '#EA80FC',
  '#A7FFEB'
];

const LectureStats = () => {
  const { instructor } = useContext(InstructorContext);
  const { lectureId } = useParams();

  const [title, setTitle] = useState('');
  const [deptDistribution, setDeptDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!instructor) return;

    // 학과별 분포 + 강의 제목 가져오기
    fetch(`http://localhost:3000/stats/lecture/${lectureId}/breakdown`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('통계 조회 실패');
        return res.json();
      })
      .then(data => {
        setTitle(data.title);
        setDeptDistribution(data.deptDistribution || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('통계 데이터 가져오기 실패:', err);
        setError('통계 데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      });
  }, [instructor, lectureId]);

  if (loading) return <div>통계 데이터를 불러오는 중입니다...</div>;
  if (error)    return <div style={{ color: 'red' }}>{error}</div>;
  if (!deptDistribution.length) return <div>등록된 데이터가 없습니다.</div>;

  // ▶ deptDistribution 예시: 
  //    [ { dept: "컴퓨터공학과", count: 18 }, { dept: "전자공학과", count: 14 }, … ]
  // 이 배열을 reduce로 순회해서 총합을 구합니다.
  const totalEnrolled = deptDistribution.reduce(
    (acc, cur) => acc + cur.count,
    0
  );

  return (
    <div style={{ padding: '1rem' }}>
      <h2> 강의 통계: {title}</h2>
      {/* 총 수강 인원 표시 */}
      <p style={{ fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: '2rem' }}>
        총 수강 인원: <strong>{totalEnrolled}명</strong>
      </p>

      <section style={{ margin: '2rem 0' }}>
        <h3>학과별 수강 인원</h3>
        <PieChart width={600} height={600}>
          <Pie
            data={deptDistribution.map(item => ({
              name: item.dept,
              value: item.count
            }))}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {deptDistribution.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={PIE_COLORS[idx % PIE_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </section>
    </div>
  );
};

export default LectureStats;
