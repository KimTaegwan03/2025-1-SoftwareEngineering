import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AnnouncementWrite() {
  const { lecture_id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setfile] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    ////////////////// lecture_id 구현하기 //////////////////////
    formData.append('lecture_id', lecture_id);
    formData.append('title', title);
    formData.append('content', content);
    if (file) formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:3000/announcement/write', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('공지사항이 등록되었습니다.');
        navigate(`/announcements/${lecture_id}`);
      } else {
        alert('등록 실패');
      }
    } catch (error) {
      console.error('에러:', error);
      alert('서버 오류');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>공지사항 작성</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '15px' }}>
          <label>제목</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>내용</label><br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>파일 업로드</label><br />
          <input type="file" onChange={(e) => setfile(e.target.files[0])} />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>
          등록
        </button>
      </form>
    </div>
  );
}
