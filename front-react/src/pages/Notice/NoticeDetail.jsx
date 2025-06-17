import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NoticeDetail() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/notice/${id}`)
      .then((res) => res.json())
      .then((data) => setNotice(data));
  }, [id]);

  if (!notice) return <p className="text-center mt-10 text-gray-500">불러오는 중...</p>;

  return (
    <div className="min-h-screen bg-[#FFF8F5] flex justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-[#8A1601] mb-4">{notice.title}</h2>

        <p className="text-gray-800 text-base whitespace-pre-wrap">{notice.content}</p>

        {notice.image_url && (
          <div className="mt-6">
            <img
              src={`http://localhost:3000${notice.image_url}`}
              alt="공지 이미지"
              className="rounded-lg w-full max-w-full"
            />
          </div>
        )}

        <p className="text-sm text-gray-500 mt-6">
          게시일: {new Date(notice.createdAt).toISOString().slice(0, 10)}
        </p>
      </div>
    </div>
  );
}
