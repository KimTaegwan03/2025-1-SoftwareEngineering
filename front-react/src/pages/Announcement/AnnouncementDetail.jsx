import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { InstructorContext } from '@/InstructorContext';

export default function AnnouncementDetail() {
  const { lecture_id, id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const { instructor } = useContext(InstructorContext);

  useEffect(() => {
    fetch(`http://localhost:3000/announcement/${id}`)
      .then((res) => res.json())
      .then((data) => setAnnouncement(data));
  }, [id]);

  const handleDownload = async () => {
    const res = await fetch(`http://localhost:3000/${announcement.file_url}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    const [, filename] = announcement.file_url.split('-', 2);
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3000/announcement/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      navigate(`/announcements/${lecture_id}`);
    } else {
      alert(data.error || '삭제 중 오류가 발생했습니다.');
    }
  };

  if (!announcement) return <p className="text-center mt-10 text-gray-500">불러오는 중...</p>;

  return (
    <div className="min-h-screen bg-[#FFF8F5] flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-[#8A1601] mb-4">{announcement.title}</h2>
        <p className="text-gray-800 whitespace-pre-wrap mb-6">{announcement.content}</p>

        {announcement.file_url && (
          <div className="mb-6">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 bg-[#8A1601] text-white rounded hover:bg-[#a3200a] transition"
            >
              📥 파일 다운로드
            </button>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-6">
          게시일: {new Date(announcement.createdAt).toISOString().slice(0, 10)}
        </p>

        <div className="flex flex-col gap-3">
          {instructor && (
            <button
              onClick={handleDelete}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              글 삭제
            </button>
          )}
          <button
            onClick={() => navigate(`/announcements/${lecture_id}`)}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
          >
            목록
          </button>
        </div>
      </div>
    </div>
  );
}
