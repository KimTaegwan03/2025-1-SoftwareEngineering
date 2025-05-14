import React, { useState } from 'react';

const LectureForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    professor: '',
    credit: '',
    schedule: '',
    syllabusContent: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/lecture/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

       if (response.ok) {
        alert('강의 및 계획서 등록 완료!');
        setFormData({
          title: '',
          professor: '',
          credit: '',
          schedule: '',
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
      <input type="text" name="title" placeholder="강의명" value={formData.title} onChange={handleChange} required />
      <input type="text" name="professor" placeholder="교수명" value={formData.professor} onChange={handleChange} required />
      <input type="number" name="credit" placeholder="학점" value={formData.credit} onChange={handleChange} required />
      <input type="text" name="schedule" placeholder="시간표 (예: 화 1-3)" value={formData.schedule} onChange={handleChange} required />

      <h3>강의 계획서</h3>
      <textarea
        name="syllabusContent"
        placeholder="강의계획서 내용을 입력하세요"
        value={formData.syllabusContent}
        onChange={handleChange}
        rows="10"
        cols="60"
        required
      />

      <br />
      <button type="submit">등록</button>
    </form>
  );
};
export default LectureForm;
