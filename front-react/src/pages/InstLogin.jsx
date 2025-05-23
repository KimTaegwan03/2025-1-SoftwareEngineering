import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InstructorContext } from '../InstructorContext';

function Login() {
  const [form, setForm] = useState({ acc_id: '', password: '' });
  const [message, setMessage] = useState('');
  const { setInstructor  } = useContext(InstructorContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/instructor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setInstructor(data.instructor); // 전역 상태에 저장
      // 로그인 성공 후 홈으로 이동
      window.location.href = '/';
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>교수 로그인</h2>
      <input name="acc_id" placeholder="아이디" onChange={handleChange} required />
      <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
      <button type="submit">로그인</button>
      <p>{message}</p>
    </form>
  );
}

export default Login;
