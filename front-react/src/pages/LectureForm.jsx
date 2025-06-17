import { useContext, useState } from 'react';
import { InstructorContext } from '../InstructorContext';

const LectureForm = () => {
  const { instructor } = useContext(InstructorContext);
  if (!instructor) return null;

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
    <div className="min-h-screen bg-[#FFF8F5] py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow border border-[#8A1601]"
      >
        <h2 className="text-2xl font-bold text-[#8A1601] mb-6 text-center">강의 등록</h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="course_id"
            placeholder="강의 코드"
            value={formData.course_id}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="text"
            name="title"
            placeholder="강의명"
            value={formData.title}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="text"
            name="dept_name"
            placeholder="학과명"
            value={formData.dept_name}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="number"
            name="credit"
            placeholder="학점"
            value={formData.credit}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="text"
            name="sec_id"
            placeholder="분반 코드"
            value={formData.sec_id}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="number"
            name="semester"
            placeholder="학기 (1 or 2)"
            value={formData.semester}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="number"
            name="year"
            placeholder="년도 (예: 2025)"
            value={formData.year}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="text"
            name="building"
            placeholder="건물명"
            value={formData.building}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="text"
            name="room_number"
            placeholder="호수"
            value={formData.room_number}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="text"
            name="professor"
            placeholder="교수명"
            value={formData.professor}
            onChange={handleChange}
            required
            className="input"
          />

          <h3 className="text-[#8A1601] font-semibold mt-4">강의 시간</h3>
          <select
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="">요일 선택</option>
            <option value="월">월</option>
            <option value="화">화</option>
            <option value="수">수</option>
            <option value="목">목</option>
            <option value="금">금</option>
          </select>
          <input
            type="number"
            name="startTime"
            placeholder="시작 교시"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="number"
            name="endTime"
            placeholder="종료 교시"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="input"
          />

          <h3 className="text-[#8A1601] font-semibold mt-4">최대 수강 인원</h3>
          <input
            type="number"
            name="maxSeats"
            placeholder="최대 수강 인원"
            value={formData.maxSeats}
            onChange={handleChange}
            required
            className="input"
          />

          <h3 className="text-[#8A1601] font-semibold mt-4">강의 계획서</h3>
          <textarea
            name="syllabusContent"
            placeholder="강의계획서 내용을 입력하세요"
            rows="6"
            value={formData.syllabusContent}
            onChange={handleChange}
            required
            className="input"
          />

          <button
            type="submit"
            className="bg-[#8A1601] text-white py-2 px-4 rounded hover:bg-[#6c1100] transition mt-4"
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default LectureForm;
