import { useState } from 'react';

function Register() {
  const [form, setForm] = useState({
    name: '',
    dept_name: '',
    tot_cred: 0,
    acc_id: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/student/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
  
      if (!res.ok) throw new Error('서버 응답 오류');
  
      const data = await res.json();
      alert(`회원가입 성공! 학생 ID: ${data.studentId}`);
    } catch (err) {
      alert('회원가입 실패: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>학생 회원가입</h2>
      <input type="text" name="name" placeholder="이름" onChange={handleChange} required />
      <input type="text" name="dept_name" placeholder="학과" onChange={handleChange} required />
      <input type="text" name="acc_id" placeholder="계정 ID" onChange={handleChange} required />
      <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} required />
      <button type="submit">회원가입</button>
    </form>
  );
}

export default Register;
