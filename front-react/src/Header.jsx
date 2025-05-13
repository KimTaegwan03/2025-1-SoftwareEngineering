import { useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { student, setStudent } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('http://localhost:3000/auth/logout', {
      credentials: 'include'
    });
    setStudent(null);
    navigate('/');
  };

  const handleRegister = () => {
    navigate('/register');
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

      {/* 오른쪽: 사용자 정보 또는 로그인/회원가입 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {student ? (
          <>
            <span>{student.name}님 환영합니다</span>
            <button onClick={() => navigate('/mypage')}>마이페이지</button>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <span>로그인 해주세요</span>
            <button onClick={() => navigate('/login')}>로그인</button>
            <button onClick={handleRegister}>회원가입</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
