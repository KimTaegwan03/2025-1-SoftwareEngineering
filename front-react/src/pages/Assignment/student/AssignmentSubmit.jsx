import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 제출한 과제 보기
export function Submit({ assignment_id }) {
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`http://localhost:3000/assignment/submit/${assignment_id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setSubmission(data);
      } catch (err) {
        console.error('과제 조회 실패:', err);
      }
    };

    fetchSubmissions();
  }, [assignment_id]);

  if (!submission) {
    return <p className="text-center text-gray-500 mt-6">제출된 과제가 없습니다.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold text-[#8A1601] mb-4">제출한 과제</h2>
      <div className="border-b border-gray-300 pb-4 mb-4">
        <h3 className="text-lg font-bold mb-1">{submission.title}</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{submission.content}</p>

        {submission.file_url && (
          <div className="mt-3">
            <a
              href={`http://localhost:3000/public/${submission.file_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8A1601] hover:underline"
            >
              📥 첨부파일 다운로드
            </a>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-2">
          제출일: {new Date(submission.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

// 과제 제출 형식
export function SubmitForm({ lecture_id, assignment_id }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('assignment_id', assignment_id);
    formData.append('title', title);
    formData.append('content', content);
    if (file) formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/assignment/submit', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) {
        alert('과제가 제출되었습니다.');
      } else {
        alert(data.message || '제출 실패');
      }
    } catch (err) {
      console.error('제출 중 에러:', err);
      alert('서버 오류');
    }

    navigate(`/assignments/${lecture_id}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mt-8 space-y-6"
    >
      <h2 className="text-xl font-semibold text-[#8A1601]">과제 제출</h2>

      <div className="mb-6">
        <label className="block mb-1 font-medium">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A1601]"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="5"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A1601] whitespace-pre-wrap"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">파일 첨부</label>
        <input
          id="fileUpload"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
        <label
          htmlFor="fileUpload"
          className="inline-block px-4 py-2 bg-[#8A1601] text-white rounded cursor-pointer hover:bg-[#a3200a] transition"
        >
          파일 선택
        </label>
        {file && <p className="text-sm text-gray-600 mt-2">{file.name}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-[#8A1601] text-white py-2 rounded hover:bg-[#a3200a] transition"
      >
        제출하기
      </button>
    </form>
  );
}
