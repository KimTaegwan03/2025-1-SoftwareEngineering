import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InstructorContext } from '@/InstructorContext';
import kwLogo from '@/assets/KW_UNIVERSITY.png';

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <img
          src={kwLogo} // 실제 경로로 교체
          alt="Kwangwoon University"
          className="mb-6 w-[300px] h-auto"
        />
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white p-8 rounded shadow"
        >
          <label className="block mb-2 text-gray-700 text-sm font-bold">id:</label>
          <input
            type="text"
            name="acc_id"
            placeholder="id"
            value={form['acc_id']}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2"
          />
  
          <label className="block mb-2 text-gray-700 text-sm font-bold">password:</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            value={form['password']}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring-2"
          />
  
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-700 text-white font-semibold rounded hover:bg-red-800 transition"
          >
            confirm
          </button>
        </form>
      </div>
    );
}

export default Login;
