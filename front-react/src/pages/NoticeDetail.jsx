import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NoticeDetail() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/data/notice/${id}`)
      .then((res) => res.json())
      .then((data) => setNotice(data));
  }, [id]);

  if (!notice) return <p>불러오는 중...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2>{notice.title}</h2>
      <p>{notice.content}</p>

      {/* 이미지가 있을 경우 표시 */}
      {notice.image_url && (
        <div style={{ marginTop: 20 }}>
          <img
            src={`http://localhost:3000${notice.image_url}`}
            alt="공지 이미지"
            style={{ maxWidth: '100%', borderRadius: 8 }}
          />
        </div>
      )}

      <p style={{ color: '#888', marginTop: 20 }}>
        게시일: {new Date(notice.createdAt).toISOString().slice(0, 10)}
      </p>
    </div>
  );
}
