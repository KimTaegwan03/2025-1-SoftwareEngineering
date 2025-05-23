import { useContext } from 'react';
import { UserContext } from './UserContext';
import { InstructorContext } from './InstructorContext'
import { useNavigate } from 'react-router-dom';

function Header() {
  const { student, setStudent } = useContext(UserContext);
  const { instructor, setInstructor } = useContext(InstructorContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('http://localhost:3000/auth/logout', {
      credentials: 'include'
    });
    setStudent(null);
    setInstructor(null);
    navigate('/');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      borderBottom: '1px solid #ccc'
    }}>
      {/* 왼쪽: Home 버튼 */}
      <button onClick={() => navigate('/')}>Home</button>
      { student ? (
        <button onClick={() => navigate('/grades')}>성적 조회</button>
      ) : instructor ? (
        <button onClick={() => navigate('/instructor/lectures')}>강의 관리</button>
      ) : (
        <p></p>
      )}

      {/* 오른쪽: 사용자 정보 또는 로그인/회원가입 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {student ? (
          <>
            <span>{student.name}님 환영합니다</span>
            <button onClick={() => navigate('/mypage')}>마이페이지</button>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : instructor ? (
          <>
            <span>{instructor.name} 교수님 환영합니다</span>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ): (
          <>
            <span>로그인 해주세요</span>
            <button onClick={() => navigate('/login')}>학생 로그인</button>
            <button onClick={() => navigate('/register')}>학생 회원가입</button>
            <button onClick={() => navigate('/instlogin')}>교수 로그인</button>
            <button onClick={() => navigate('/instregister')}>교수 회원가입</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
