import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 제출한 과제 보기
export function Submit( {assignment_id }) {
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`http://localhost:3000/assignment/submit/${assignment_id}`, {
          credentials: 'include'
        });
        const data = await res.json();
        setSubmission(data);
      } catch (err) {
        console.error('과제 조회 실패:', err);
      }
    };

    fetchSubmissions();
  }, []);

  if (!submission) return <p>제출된 과제가 없습니다.</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2>제출한 과제 목록</h2>
      <div style={{ borderBottom: '1px solid #ccc', marginBottom: 20, paddingBottom: 15 }}>
          <h3>{submission.title}</h3>
          <p>{submission.content}</p>
          {submission.file_url && (
            <a href={`http://localhost:3000/public/${submission.file_url}`} target="_blank" rel="noopener noreferrer">
              📥 첨부파일 다운로드
            </a>
          )}
          <p style={{ color: '#888', marginTop: 10 }}>
            제출일: {new Date(submission.createdAt).toLocaleDateString()}
          </p>
        </div>
    </div>
  );
}

// 과제 제출 형식
export function SubmitForm({ lecture_id, assignment_id }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('assignment_id', assignment_id);
    formData.append('title', title);
    formData.append('content', content);
    if (file) formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/assignment/submit', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await res.json();
      if (res.ok) {
        alert('과제가 제출되었습니다.');
      } else {
        alert(data.message || '제출 실패');
      }
    } catch (err) {
      console.error('제출 중 에러:', err);
      alert('서버 오류');
    }

	navigate(`/assignments/${lecture_id}`)
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>과제 제출</h2>

      <div>
        <label>제목</label><br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>내용</label><br />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="5"
          required
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>파일 첨부</label><br />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button type="submit" style={{ marginTop: 20 }}>제출하기</button>
    </form>
  );
}