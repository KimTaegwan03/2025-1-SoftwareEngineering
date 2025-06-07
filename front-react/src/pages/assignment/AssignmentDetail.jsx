import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { InstructorContext } from '@/InstructorContext';

export default function AssignmentDetail() {
  const { lecture_id, id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);

  const { instructor, setInstructor  } = useContext(InstructorContext);

  useEffect(() => {
    fetch(`http://localhost:3000/assignment/${id}`)
      .then((res) => res.json())
      .then((data) => setAssignment(data));
  }, [id]);

  const handleDownload = async () => {
    const res = await fetch(`http://localhost:3000/${assignment.file_url}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    const [id, filename] = assignment.file_url.split('-', 2);
    link.href = url;
    link.download = filename; // 실제 저장될 파일명
    link.click();
    window.URL.revokeObjectURL(url); // 메모리 해제
  };

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3000/assignment/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();

    if (res.ok) {
      alert(data.message); // ✅ 서버에서 온 메시지 출력
      navigate(`/assignments/${lecture_id}`); // ✅ 이동
    } else {
      alert(data.error || '삭제 중 오류가 발생했습니다.');
    }
  }

  if (!assignment) return <p>불러오는 중...</p>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ padding: 30 }}>
        <h2>{assignment.title}</h2>
        <p>{assignment.content}</p>

        <div style={{ padding: 20 }}>
          { assignment.file_url ? <button onClick={handleDownload}>📥 파일 다운로드</button> : <></> }
        </div>

        <p style={{ color: '#888', marginTop: 20 }}>
          게시일: {new Date(assignment.createdAt).toISOString().slice(0, 10)}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button onClick={handleDelete}>글 삭제</button>
          <button onClick={()=>navigate(`/assignments/${lecture_id}`)}>목록</button>
        </div>
      </div>
    </div>
  );
}
