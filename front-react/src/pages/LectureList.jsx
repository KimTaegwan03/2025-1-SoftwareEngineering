import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LectureList = () => {
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/lecture/list')
      .then(res => res.json())
      .then(data => setLectures(data))
      .catch(err => console.error('강의 목록 불러오기 실패:', err));
  }, []);

  return (
    <div>
      <h2>강의 목록</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>강의코드</th>
            <th>분반</th>
            <th>강의명</th>
            <th>학과명</th>
            <th>학점</th>
            <th>학기</th>
            <th>연도</th>
            <th>강의실</th>
            <th>교수</th>
            <th>최대인원</th>
            <th>계획서</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map(lecture => (
            <tr key={lecture.id}>
              <td>{lecture.course_id}</td>
              <td>{lecture.sec_id}</td>
              <td>{lecture.title}</td>
              <td>{lecture.dept_name}</td>
              <td>{lecture.credit}</td>
              <td>{lecture.semester}</td>
              <td>{lecture.year}</td>
              <td>{lecture.building} {lecture.room_number}</td>
              <td>{lecture.professor}</td>
              <td>{lecture.maxSeats}</td>
              <td>
                <Link to={`/syllabus/${lecture.id}`}>보기</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LectureList;
