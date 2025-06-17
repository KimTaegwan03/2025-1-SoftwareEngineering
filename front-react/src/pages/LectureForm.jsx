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
          <label htmlFor="course_id" className="text-[#8A1601] font-semibold">강의 코드</label>
          <input
            id="course_id"
            type="text"
            name="course_id"
            placeholder="예: CS101 (영문 대문자+숫자)"
            pattern="[A-Z]{2,}[0-9]{2,}"
            title="영문 대문자+숫자 형식"
            value={formData.course_id}
            onChange={handleChange}
            required
            className="input"
          />

          <label htmlFor="title" className="text-[#8A1601] font-semibold">강의명</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="최대 50자"
            maxLength={50}
            value={formData.title}
            onChange={handleChange}
            required
            className="input"
          />

          <label htmlFor="dept_name" className="text-[#8A1601] font-semibold">학과명</label>
          <input
            id="dept_name"
            type="text"
            name="dept_name"
            placeholder="최대 50자"
            maxLength={50}
            value={formData.dept_name}
            onChange={handleChange}
            required
            className="input"
          />

          <label htmlFor="credit" className="text-[#8A1601] font-semibold">학점</label>
          <input
            id="credit"
            type="number"
            name="credit"
            placeholder="1~3"
            min="1"
            max="3"
            value={formData.credit}
            onChange={handleChange}
            required
            className="input"
          />

          <label htmlFor="sec_id" className="text-[#8A1601] font-semibold">분반 코드</label>
          <input
            id="sec_id"
            type="text"
            name="sec_id"
            placeholder="최대 10자"
            maxLength={10}
            value={formData.sec_id}
            onChange={handleChange}
            required
            className="input"
          />

          <label htmlFor="semester" className="text-[#8A1601] font-semibold">학기</label>
          <input
            id="semester"
            type="number"
            name="semester"
            placeholder="1 또는 2"
            min="1"
            max="2"
            value={formData.semester}
            onChange={handleChange}
            required
            className="input"
          />

          <label htmlFor="year" className="text-[#8A1601] font-semibold">년도</label>
          <input
            id="year"
            type="number"
            name="year"
            placeholder="예: 2025"
            min="2020"
            max="2099"
            value={formData.year}
            onChange={handleChange}
            required
            className="input"
          />

          <label htmlFor="building" className="text-[#8A1601] font-semibold">건물명</label>
          <input
            id="building"
            type="text"
            name="building"
            placeholder="최대 30자"
            maxLength={30}
            value={formData.building}
            onChange={handleChange}
            required
            className="input"
          />

          <label htmlFor="room_number" className="text-[#8A1601] font-semibold">호수</label>
          <input
            id="room_number"
            type="text"
            name="room_number"
            placeholder="최대 10자"
            maxLength={10}
            value={formData.room_number}
            onChange={handleChange}
            required
            className="input"
          />

          <label htmlFor="professor" className="text-[#8A1601] font-semibold">교수명</label>
          <input
            id="professor"
            type="text"
            name="professor"
            placeholder="한글만, 2자 이상"
            pattern="[가-힣\s]{2,}"
            title="한글 이름만 입력 가능"
            value={formData.professor}
            onChange={handleChange}
            required
            className="input"
          />

          <h3 className="text-[#8A1601] font-semibold mt-4">강의 시간</h3>
          <label htmlFor="day" className="text-[#8A1601] font-medium">요일</label>
          <select
            id="day"
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

          <label htmlFor="startTime" className="text-[#8A1601] font-medium">시작 교시</label>
          <input
            id="startTime"
            type="number"
            name="startTime"
            placeholder="1~9"
            min="1"
            max="9"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="input"
          />

          <label htmlFor="endTime" className="text-[#8A1601] font-medium">종료 교시</label>
          <input
            id="endTime"
            type="number"
            name="endTime"
            placeholder="1~9 (시작 교시 이상)"
            min={formData.startTime || 1}
            max="9"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="input"
          />

          <label htmlFor="maxSeats" className="text-[#8A1601] font-semibold mt-4">최대 수강 인원</label>
          <input
            id="maxSeats"
            type="number"
            name="maxSeats"
            placeholder="1~500"
            min="1"
            max="500"
            value={formData.maxSeats}
            onChange={handleChange}
            required
            className="input"
          />

          <label htmlFor="syllabusContent" className="text-[#8A1601] font-semibold mt-4">강의 계획서</label>
          <textarea
            id="syllabusContent"
            name="syllabusContent"
            placeholder="최대 5000자까지 입력 가능"
            rows="6"
            maxLength="5000"
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
