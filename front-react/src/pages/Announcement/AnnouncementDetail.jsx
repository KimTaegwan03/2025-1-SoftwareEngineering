import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NoticeDetail() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/announcement/${id}`)
      .then((res) => res.json())
      .then((data) => setAnnouncement(data));
  }, [id]);

  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:3000/announcement/download');

      if (!response.ok) {
        throw new Error('다운로드 실패');
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'downloaded_file';

      // 서버가 Content-Disposition 헤더로 파일명 제공 시 추출
      if (contentDisposition && contentDisposition.includes('filename=')) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('다운로드 중 오류 발생:', err);
    }
  };

  if (!announcement) return <p>불러오는 중...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2>{announcement.title}</h2>
      <p>{announcement.content}</p>

      <div style={{ padding: 20 }}>
        <button onClick={handleDownload}>📥 파일 다운로드</button>
      </div>

      <p style={{ color: '#888', marginTop: 20 }}>
        게시일: {new Date(announcement.createdAt).toISOString().slice(0, 10)}
      </p>
    </div>
  );
}
