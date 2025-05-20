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
      <h2>📘 강의 계획서</h2>
      <p><strong>강의코드:</strong> {syllabus.course_id}</p>
      <p><strong>분반코드:</strong> {syllabus.sec_id}</p>
      <p><strong>강의명:</strong> {syllabus.title}</p>
      <p><strong>학과명:</strong> {syllabus.dept_name}</p>
      <p><strong>교수:</strong> {syllabus.professor}</p>
      <p><strong>학점:</strong> {syllabus.credit}</p>
      <p><strong>학기 / 연도:</strong> {syllabus.semester} / {syllabus.year}</p>
      <p><strong>강의실:</strong> {syllabus.building} {syllabus.room_number}</p>

      {syllabus.scheduleTimes && (
        <p><strong>요일 / 교시:</strong> {syllabus.scheduleDay} / [{syllabus.scheduleTimes.join(', ')}]</p>
      )}

      <h3>📄 내용</h3>
      <pre>{syllabus.content}</pre>
    </div>
  );
};

export default SyllabusDetail;
