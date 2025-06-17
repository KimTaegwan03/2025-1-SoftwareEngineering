import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AssignmentWrite() {
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
      const response = await fetch('http://localhost:3000/assignment/write', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('과제가 등록되었습니다.');
        navigate(`/assignments/${lecture_id}`);
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
        <h2 className="text-2xl font-bold text-[#8A1601] mb-6">과제 작성</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
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

          <div>
            <label className="block font-medium mb-1">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="10"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A1601] whitespace-pre-wrap"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">파일 업로드</label>
            <input
              id="fileUpload"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block"
            />
            {file && <p className="text-sm text-gray-600 mt-2">{file.name}</p>}
          </div>

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
