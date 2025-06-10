import { useState } from 'react';
import kwLogo from '@/assets/KW_UNIVERSITY.png';

function Register() {
  const [form, setForm] = useState({
    name: '',
    dept_name: '',
    acc_id: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/instructor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
  
      if (!res.ok) throw new Error('서버 응답 오류');
  
      const data = await res.json();
      alert(`회원가입 성공! 교수 ID: ${data.instructorId}`);
      
      window.location.href = '/instlogin';
    } catch (err) {
      alert('회원가입 실패: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <img
        src={kwLogo}
        alt="Kwangwoon University"
        className="mb-6 w-[300px] h-auto"
      />
      <form onSubmit={handleSubmit}
      className="w-full max-w-sm bg-white p-8 rounded shadow">
        <h2 className="text-center font-bold">교수 회원가입</h2>
        <label className="block mb-2 text-gray-700 text-sm font-bold">ID:</label>
        <input type="text" name="acc_id" placeholder="계정 ID" onChange={handleChange} required className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2"/>
        <label className="block mb-2 text-gray-700 text-sm font-bold">비밀번호:</label>
        <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} required className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2"/>
        <label className="block mb-2 text-gray-700 text-sm font-bold">이름:</label>
        <input type="text" name="name" placeholder="이름" onChange={handleChange} required className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2"/>
        <label className="block mb-2 text-gray-700 text-sm font-bold">학과:</label>
        <input type="text" name="dept_name" placeholder="학과" onChange={handleChange} required className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2"/>
        <button type="submit" className="w-full py-2 px-4 bg-red-700 text-white font-semibold rounded hover:bg-red-800 transition">회원가입</button>
      </form>
    </div>
  );
}

export default Register;
