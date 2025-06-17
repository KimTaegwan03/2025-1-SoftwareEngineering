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

  const totalEnrolled = deptDistribution.reduce(
    (acc, cur) => acc + cur.count,
    0
  );

  if (loading) return <div className="text-center py-8 text-lg">통계 데이터를 불러오는 중입니다...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;
  if (!deptDistribution.length) return <div className="text-center py-8 text-gray-600">등록된 데이터가 없습니다.</div>;

  return (
    <div className="min-h-screen bg-[#FFF8F5] px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white border border-[#8A1601] rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-[#8A1601] text-center mb-6">
          강의 통계: {title}
        </h2>

        <p className="text-lg text-center text-gray-800 mb-8">
          총 수강 인원: <span className="font-semibold text-[#8A1601]">{totalEnrolled}명</span>
        </p>

        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold text-[#8A1601] mb-4">학과별 수강 인원</h3>
          <PieChart width={500} height={500}>
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
        </div>
      </div>
    </div>
  );
};

export default LectureStats;
