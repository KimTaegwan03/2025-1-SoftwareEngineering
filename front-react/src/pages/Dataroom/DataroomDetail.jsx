import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { InstructorContext } from '@/InstructorContext';

export default function DataroomDetail() {
  const { lecture_id, id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const { instructor } = useContext(InstructorContext);

  useEffect(() => {
    fetch(`http://localhost:3000/data/${id}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [id]);

  const handleDownload = async () => {
    const res = await fetch(`http://localhost:3000/${data.file_url}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const [, filename] = data.file_url.split('-', 2);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3000/data/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      navigate(`/datas/${lecture_id}`);
    } else {
      alert(data.error || '삭제 중 오류가 발생했습니다.');
    }
  };

  if (!data) return <p className="text-center mt-10 text-gray-500">불러오는 중...</p>;

  return (
    <div className="min-h-screen bg-[#FFF8F5] px-4 py-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-[#8A1601] mb-6 border-b pb-2">자료실</h2>

        {/* 제목 박스 */}
        <div className="border border-gray-200 bg-gray-50 rounded p-4 mb-6">
          <div className="text-lg font-semibold text-[#8A1601] mb-2">{data.title}</div>
          <div className="text-sm text-gray-600 flex gap-4 flex-wrap">
            <span>작성자: {data.writer || '관리자'}</span>
            <span>등록일: {new Date(data.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* 파일 정보 */}
        {data.file_url && (
          <div className="mb-4 border-b pb-4">
            <span className="text-sm text-gray-700 mr-2">📎 파일:</span>
            <button
              onClick={handleDownload}
              className="text-blue-600 hover:underline text-sm"
            >
              {data.file_url.split('-').pop()} [다운로드]
            </button>
          </div>
        )}

        {/* 본문 내용 */}
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed mb-10">
          {data.content}
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          {instructor && (
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              삭제
            </button>
          )}
          <button
            onClick={() => navigate(`/datas/${lecture_id}`)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            목록
          </button>
        </div>
      </div>
    </div>
  );
}
