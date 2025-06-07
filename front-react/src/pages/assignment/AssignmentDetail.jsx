import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AnnouncementDetail() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/announcement/${id}`)
      .then((res) => res.json())
      .then((data) => setAnnouncement(data));
  }, [id]);

  const handleDownload = async () => {
    const res = await fetch(`http://localhost:3000/public/${announcement.file_url}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample.pdf'; // 실제 저장될 파일명
    link.click();
    window.URL.revokeObjectURL(url); // 메모리 해제
  };

  if (!announcement) return <p>불러오는 중...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2>{announcement.title}</h2>
      <p>{announcement.content}</p>

      <div style={{ padding: 20 }}>
        { announcement.file_url ? <button onClick={handleDownload}>📥 파일 다운로드</button> : <></> }
      </div>

      <p style={{ color: '#888', marginTop: 20 }}>
        게시일: {new Date(announcement.createdAt).toISOString().slice(0, 10)}
      </p>
    </div>
  );
}
