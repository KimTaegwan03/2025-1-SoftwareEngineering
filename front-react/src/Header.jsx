import { useContext, useState  } from 'react';
import { UserContext } from './UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { InstructorContext } from './InstructorContext'
import { TeamContext } from './TeamContext'
import kwLogoH from '@/assets/KW_UNIVERSITY.png';

function Header() {
  const { student, setStudent } = useContext(UserContext);
  const { instructor, setInstructor } = useContext(InstructorContext);
  const { team, setTeam } = useContext(TeamContext);
  const [loginHover, setLoginHover] = useState(false);
  const [registerHover, setRegisterHover] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('http://localhost:3000/auth/logout', {
      credentials: 'include'
    });
    setStudent(null);
    setInstructor(null);
    setTeam(null);
    navigate('/');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      paddingLeft: '20rem',
      paddingRight: '20rem',
      borderBottom: '1px solid #ccc',
      backgroundColor: '#8A1601',
      height: '80px',
    }}>

      {/* 왼쪽: Home 버튼 */}
      <nav className="flex space-x-4">
        <Link to='/' style={{color:'#fff', fontWeight:'bold', marginRight:"3rem"}}>광운누리</Link>
        <Link to='/notice' style={{color:'#fff', fontWeight:'bold', marginRight:"2rem"}}>공지사항</Link>
        { student ? (
          <Link to='/grades' style={{color:'#fff', fontWeight:'bold', marginRight:"2rem"}}>성적 조회</Link>
        ) : instructor ? (
          <Link to='/instructor/lectures' style={{color:'#fff', fontWeight:'bold', marginRight:"2rem"}}>강의 관리</Link>
        ) : (
          <p></p>
        )}
      </nav>

      {/* 오른쪽: 사용자 정보 또는 로그인/회원가입 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {student ? (
          <>
            <span style={{color:'#fff', fontWeight:'bold'}}>{student.name}님 환영합니다</span>
            <button onClick={() => navigate('/mypage')} style={{color:'#fff', fontWeight:'bold'}}>마이페이지</button>
            <button onClick={handleLogout} style={{color:'#fff', fontWeight:'bold'}}>로그아웃</button>
          </>
        ) : instructor ? (
          <>
            <span style={{color:'#fff', fontWeight:'bold'}}>{instructor.name} 교수님 환영합니다</span>
            <button onClick={handleLogout} style={{color:'#fff', fontWeight:'bold'}}>로그아웃</button>
          </>
        ): team ? (
          <>
            <span style={{color:'#fff', fontWeight:'bold'}}>{team.name} 환영합니다</span>
            <button onClick={handleLogout} style={{color:'#fff', fontWeight:'bold'}}>로그아웃</button>
          </>
        ): (
          <>
            <span style={{color:'#fff', fontWeight:'bold'}}>로그인 해주세요</span>
            {/* 로그인 드롭다운 */}
            <div
              style={{ position: 'relative' }}
            >
              <button onClick={() => navigate('/login')} style={{ display: 'block', width: '100%', color:'#fff', fontWeight:'bold' }}>
                로그인
              </button>
            </div>
            {/* 회원가입 드롭다운 */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setRegisterHover(true)}
              onMouseLeave={() => setRegisterHover(false)}
            >
              <p style={{color:'#fff', fontWeight:'bold'}}>회원가입</p>
              {registerHover && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  width: '170px',
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  padding: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  zIndex: 100
                }}>
                  <button onClick={() => navigate('/register')} style={{ display: 'block', width: '100%', padding: '0.5rem', textAlign: 'center' }}>
                    학생 회원가입
                  </button>
                  <button onClick={() => navigate('/instregister')} style={{ display: 'block', width: '100%', padding: '0.5rem', textAlign: 'center' }}>
                    교수 회원가입
                  </button>
                  <button onClick={() => navigate('/teamregister')} style={{ display: 'block', width: '100%', padding: '0.5rem', textAlign: 'center' }}>
                    교학팀 회원가입
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
