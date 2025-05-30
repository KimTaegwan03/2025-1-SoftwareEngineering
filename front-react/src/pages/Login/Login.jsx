import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/UserContext';
import { InstructorContext } from '@/InstructorContext';
import { TeamContext } from '@/TeamContext';
import kwLogo from '@/assets/KW_UNIVERSITY.png';

function Login() {
  const [form, setForm] = useState({
    acc_id: '',
    password: '',
    user_type: 'student' // 기본값
  });
  const [message, setMessage] = useState('');
  const { setStudent } = useContext(UserContext);
  const { setInstructor  } = useContext(InstructorContext);
  const { setTeam  } = useContext(TeamContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const endpoint = {
      student: 'http://localhost:3000/auth/student/login',
      instructor: 'http://localhost:3000/auth/instructor/login',
      team: 'http://localhost:3000/auth/team/login'
    }[form.user_type];

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (form.user_type == 'student') setStudent(data.student);
      else if (form.user_type == 'instructor') setInstructor(data.instructor);
      else if (form.user_type == 'team') setTeam(data.team);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <img
        src={kwLogo}
        alt="Kwangwoon University"
        className="mb-6 w-[300px] h-auto"
      />
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-8 rounded shadow"
      >
        {/* 사용자 유형 선택 */}
        <label className="block mb-2 text-gray-700 text-sm font-bold">
          Login Type:
        </label>
        <select
          name="user_type"
          value={form.user_type}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2"
        >
          <option value="student">학생 로그인</option>
          <option value="instructor">교수 로그인</option>
          <option value="team">교학팀 로그인</option>
        </select>

        <label className="block mb-2 text-gray-700 text-sm font-bold">id:</label>
        <input
          type="text"
          name="acc_id"
          placeholder="id"
          value={form.acc_id}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2"
        />

        <label className="block mb-2 text-gray-700 text-sm font-bold">password:</label>
        <input
          type="password"
          name="password"
          placeholder="password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring-2"
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-red-700 text-white font-semibold rounded hover:bg-red-800 transition"
        >
          confirm
        </button>

        {message && <p className="text-red-500 mt-4 text-sm">{message}</p>}
      </form>
    </div>
  );
}


export default Login;
