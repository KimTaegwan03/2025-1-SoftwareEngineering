import { useEffect, useState } from 'react';

function MyPage() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/auth/mypage', {
      credentials: 'include'
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('로그인이 필요합니다');
        const data = await res.json();
        setStudent(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>불러오는 중...</div>;
  if (error) return <div>{error}</div>;
  if (!student) return <div>정보 없음</div>;

return (
    <div style={{ minHeight: `${window.innerHeight}px`, padding: '2rem', textAlign: 'center', backgroundColor: '#f6f6f6' }}>
        <div id='upper' style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
        <h2>마이페이지</h2>
        <table style={{ margin: '1rem auto', borderCollapse: 'collapse', width: '80%' }} border="1">
            <thead>
                <tr>
                    <th style={{ padding: '0.5rem' }}>항목</th>
                    <th style={{ padding: '0.5rem' }}>내용</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ padding: '0.5rem' }}>이름</td>
                    <td style={{ padding: '0.5rem' }}>{student.name}</td>
                </tr>
                <tr>
                    <td style={{ padding: '0.5rem' }}>학과</td>
                    <td style={{ padding: '0.5rem' }}>{student.dept_name}</td>
                </tr>
                <tr>
                    <td style={{ padding: '0.5rem' }}>총 이수 학점</td>
                    <td style={{ padding: '0.5rem' }}>{student.tot_cred}</td>
                </tr>
                <tr>
                    <td style={{ padding: '0.5rem' }}>이메일</td>
                    <td style={{ padding: '0.5rem' }}>{student.email}</td>
                </tr>
                <tr>
                    <td style={{ padding: '0.5rem' }}>전화번호</td>
                    <td style={{ padding: '0.5rem' }}>{student.phone}</td>
                </tr>
                <tr>
                    <td style={{ padding: '0.5rem' }}>주소</td>
                    <td style={{ padding: '0.5rem' }}>{student.address}</td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
);
}

export default MyPage;
