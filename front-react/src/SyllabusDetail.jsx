import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SyllabusDetail = () => {
  const { lectureId } = useParams();
  const [syllabus, setSyllabus] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/syllabus/${lectureId}`)
      .then(res => res.json())
      .then(data => setSyllabus(data))
      .catch(err => console.error('계획서 불러오기 실패:', err));
  }, [lectureId]);

  if (!syllabus) return <p>불러오는 중...</p>;

  return (
    <div>
      <h2>강의 계획서</h2>
      <p><strong>강의명:</strong> {syllabus.lectureTitle}</p>
      <p><strong>교수:</strong> {syllabus.professor}</p>
      <p><strong>내용:</strong></p>
      <pre>{syllabus.content}</pre>
    </div>
  );
};

export default SyllabusDetail;
