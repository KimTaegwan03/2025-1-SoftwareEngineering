import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { InstructorContext } from '@/InstructorContext';
import { UserContext } from '@/UserContext';

import { AnswerList, AnswerForm } from '@/pages/Qna/Answer'

export default function QuestionDetail() {
  const { lecture_id, question_id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);

  const { instructor, setInstructor  } = useContext(InstructorContext);
  const { student, setStudent  } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:3000/question/${question_id}`)
      .then((res) => res.json())
      .then((data) => setQuestion(data));
  }, [question_id]);

  const handleDownload = async () => {
    const res = await fetch(`http://localhost:3000/${question.file_url}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    const [id, filename] = question.file_url.split('-', 2);
    link.href = url;
    link.download = filename; // 실제 저장될 파일명
    link.click();
    window.URL.revokeObjectURL(url); // 메모리 해제
  };

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3000/question/delete/${question_id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();

    if (res.ok) {
      alert(data.message); // ✅ 서버에서 온 메시지 출력
      navigate(`/questions/${lecture_id}`); // ✅ 이동
    } else {
      alert(data.error || '삭제 중 오류가 발생했습니다.');
    }
  }

  if (!question) return <p>불러오는 중...</p>;

  return (
    <div className="p-4 border rounded shadow mb-4">
      <h2 className="text-xl font-bold mb-2">Q. {question.title}</h2>
      <p className="text-gray-700 mb-4">{question.content}</p>
      <div style={{ padding: 20 }}>
        { question.file_url ? <button onClick={handleDownload}>📥 파일 다운로드</button> : <></> }
      </div>

      <p style={{ color: '#888', marginTop: 20 }}>
        게시일: {new Date(question.createdAt).toISOString().slice(0, 10)}
      </p>

      <AnswerList question_id={ question_id }/>
      { instructor ? <AnswerForm question_id={ question_id }/> : null }
      
    </div>
  );
}
