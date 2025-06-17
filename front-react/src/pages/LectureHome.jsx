// src/pages/LectureHome.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function LectureHome() {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/lecture/${lectureId}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('강의 상세를 불러올 수 없습니다.');
        return res.json();
      })
      .then(data => setLecture(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [lectureId]);

  if (loading) return <p>불러오는 중...</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;
  if (!lecture) return <p>강의를 찾을 수 없습니다.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📚 강의 홈: {lecture.title}</h2>
      <p><strong>강의코드:</strong> {lecture.course_id}</p>
      <p><strong>분반:</strong> {lecture.sec_id}</p>
      <p><strong>교수:</strong> {lecture.professor}</p>
      <p>
        <strong>학점/학기/연도:</strong> {lecture.credit}점 / {lecture.semester}학기 / {lecture.year}년
      </p>
      <p><strong>강의실:</strong> {lecture.building} {lecture.room_number}</p>
      <h3>📝 강의 계획서</h3>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f8f8f8', padding: '1rem' }}>
        {lecture.content}
      </pre>
    </div>
  );
}
