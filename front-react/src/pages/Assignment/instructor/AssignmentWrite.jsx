import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AssignmentWrite() {
  const { lecture_id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [start_dt, setStartDate] = useState('');
  const [end_dt, setDeadline] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('lecture_id', lecture_id);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('start_dt', start_dt);
    formData.append('end_dt', end_dt);
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
    <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-[#8A1601] mb-6 text-center">과제 작성</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#8A1601] mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-[#D9B6AE] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A1601] text-[#8A1601]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#8A1601] mb-1">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="10"
              className="w-full border border-[#D9B6AE] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A1601] text-[#8A1601] whitespace-pre-wrap"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#8A1601] mb-1">시작일</label>
              <input
                type="datetime-local"
                value={start_dt}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full rounded-md px-4 py-2 border border-[#D9B6AE] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8A1601] text-[#8A1601] font-medium bg-white hover:border-[#8A1601] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#8A1601] mb-1">마감일</label>
              <input
                type="datetime-local"
                value={end_dt}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full rounded-md px-4 py-2 border border-[#D9B6AE] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8A1601] text-[#8A1601] font-medium bg-white hover:border-[#8A1601] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#8A1601] mb-1">파일 업로드</label>

            <div className="flex items-center gap-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-[#D9B6AE] text-[#8A1601] text-sm px-3 py-1.5 rounded-md hover:bg-[#c8a295] transition"
              >
                파일 선택
              </label>
              {file && <p className="text-sm text-gray-600 truncate">{file.name}</p>}
            </div>

            <input
              id="file-upload"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
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
