import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AnnouncementWrite() {
  const { lecture_id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
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
    <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-[#8A1601] mb-6">공지사항 작성</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="block font-medium mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A1601]"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block font-medium mb-1">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="10"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A1601]"
            />
          </div>

          {/* 파일 업로드 */}
          <div>
            <label className="block font-medium mb-1">파일 업로드</label>

            {/* 숨겨진 input */}
            <input
              id="fileUpload"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />

            {/* 업로드 버튼 */}
            <label
              htmlFor="fileUpload"
              className="inline-block px-4 py-2 bg-[#8A1601] text-white rounded cursor-pointer hover:bg-[#a3200a] transition"
            >
              파일 선택
            </label>

            {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full bg-[#8A1601] text-white py-2 rounded hover:bg-[#a3200a] transition"
          >
            등록
          </button>
        </form>
      </div>
    </div>
  );
}
