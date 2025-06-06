import { useContext, useState } from 'react';
import { InstructorContext } from '../InstructorContext';

const LectureForm = () => {
    const { instructor } = useContext(InstructorContext);
    if (!instructor) return;
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    dept_name: '',
    credit: '',
    sec_id: '',
    semester: '',
    year: '',
    building: '',
    room_number: '',
    professor: '',
    day: '',
    startTime: '',
    endTime: '',
    maxSeats: '',
    syllabusContent: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();



    const start = Number(formData.startTime);
    const end = Number(formData.endTime);
    const times = [];
    for (let i = start; i <= end; i++) times.push(i);

    const payload = {
      ...formData,
      scheduleDay: formData.day,
      scheduleTimes: times,
        instructor_id: instructor?.id 
    };

    try {
      const response = await fetch('http://localhost:3000/lecture/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
         credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('강의 및 계획서 등록 완료!');
        setFormData({
          course_id: '',
          title: '',
          dept_name: '',
          credit: '',
          sec_id: '',
          semester: '',
          year: '',
          building: '',
          room_number: '',
          professor: '',
          day: '',
          startTime: '',
          endTime: '',
          maxSeats: '',
          syllabusContent: ''
        });
      } else {
        alert('등록 실패');
      }
    } catch (err) {
      alert('에러 발생: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>강의 등록</h2>

      <input type="text" name="course_id" placeholder="강의 코드" value={formData.course_id} onChange={handleChange} required />
      <input type="text" name="title" placeholder="강의명" value={formData.title} onChange={handleChange} required />
      <input type="text" name="dept_name" placeholder="학과명" value={formData.dept_name} onChange={handleChange} required />
      <input type="number" name="credit" placeholder="학점" value={formData.credit} onChange={handleChange} required />

      <input type="text" name="sec_id" placeholder="분반 코드" value={formData.sec_id} onChange={handleChange} required />
      <input type="number" name="semester" placeholder="학기 (1 or 2)" value={formData.semester} onChange={handleChange} required />
      <input type="number" name="year" placeholder="년도 (예: 2025)" value={formData.year} onChange={handleChange} required />

      <input type="text" name="building" placeholder="건물명" value={formData.building} onChange={handleChange} required />
      <input type="text" name="room_number" placeholder="호수" value={formData.room_number} onChange={handleChange} required />

      <input type="text" name="professor" placeholder="교수명" value={formData.professor} onChange={handleChange} required />

      <h3>강의 시간</h3>
      <select name="day" value={formData.day} onChange={handleChange} required>
        <option value="">요일 선택</option>
        <option value="월">월</option>
        <option value="화">화</option>
        <option value="수">수</option>
        <option value="목">목</option>
        <option value="금">금</option>
      </select>
      <input type="number" name="startTime" placeholder="시작 교시" value={formData.startTime} onChange={handleChange} required />
      <input type="number" name="endTime" placeholder="종료 교시" value={formData.endTime} onChange={handleChange} required />

      <h3>최대 수강 인원</h3>
      <input type="number" name="maxSeats" placeholder="최대 수강 인원" value={formData.maxSeats} onChange={handleChange} required />

      <h3>강의 계획서</h3>
      <textarea name="syllabusContent" placeholder="강의계획서 내용을 입력하세요" rows="10" cols="60" value={formData.syllabusContent} onChange={handleChange} required />

      <br />
      <button type="submit">등록</button>
    </form>
  );
};

export default LectureForm;
