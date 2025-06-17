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

  if (!syllabus) return <p className="text-center py-6 text-lg">불러오는 중...</p>;

  return (
    <div className="min-h-screen bg-[#FFF8F5] p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 border border-[#8A1601]">
        <h2 className="text-3xl font-bold text-[#8A1601] mb-6 text-center">강의 계획서</h2>

        <div className="space-y-3 text-sm md:text-base">
          <p><span className="font-semibold text-[#8A1601]">강의코드:</span> {syllabus.course_id}</p>
          <p><span className="font-semibold text-[#8A1601]">분반코드:</span> {syllabus.sec_id}</p>
          <p><span className="font-semibold text-[#8A1601]">강의명:</span> {syllabus.title}</p>
          <p><span className="font-semibold text-[#8A1601]">학과명:</span> {syllabus.dept_name}</p>
          <p><span className="font-semibold text-[#8A1601]">교수:</span> {syllabus.professor}</p>
          <p><span className="font-semibold text-[#8A1601]">학점:</span> {syllabus.credit}</p>
          <p><span className="font-semibold text-[#8A1601]">학기 / 연도:</span> {syllabus.semester} / {syllabus.year}</p>
          <p><span className="font-semibold text-[#8A1601]">강의실:</span> {syllabus.building} {syllabus.room_number}</p>

          {syllabus.scheduleTimes && (
            <p><span className="font-semibold text-[#8A1601]">요일 / 교시:</span> {syllabus.scheduleDay} / [{syllabus.scheduleTimes.join(', ')}]</p>
          )}
        </div>

        <h3 className="text-xl font-bold text-[#8A1601] mt-8 mb-2">내용</h3>
        <pre className="whitespace-pre-wrap bg-[#FAF1ED] p-4 rounded-md border border-[#e5cfc5] text-sm">
          {syllabus.content}
        </pre>
      </div>
    </div>
  );
};

export default SyllabusDetail;
