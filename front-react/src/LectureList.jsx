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
            <th>강의명</th>
            <th>교수</th>
            <th>학점</th>
            <th>시간표</th>
            <th>계획서</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map(lecture => (
            <tr key={lecture.id}>
              <td>{lecture.title}</td>
              <td>{lecture.professor}</td>
              <td>{lecture.credit}</td>
              <td>{lecture.schedule}</td>
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
