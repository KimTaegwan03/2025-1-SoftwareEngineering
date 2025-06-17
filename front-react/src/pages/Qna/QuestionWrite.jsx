import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function QuestionWrite() {
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
      const response = await fetch('http://localhost:3000/question/write', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        alert('질문이 등록되었습니다.');
        navigate(`/questions/${lecture_id}`);
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
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow border border-[#D9B6AE]">
        <h2 className="text-2xl font-bold text-[#8A1601] mb-6 text-center">질문 작성</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A1601]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#8A1601]"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">이미지 첨부</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded file:bg-[#8A1601] file:text-white hover:file:bg-[#6c1100]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#8A1601] text-white py-2 px-4 rounded hover:bg-[#6c1100] transition"
          >
            등록
          </button>
        </form>
      </div>
    </div>
  );
}
