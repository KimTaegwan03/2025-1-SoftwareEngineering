import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { InstructorContext } from '@/InstructorContext';
import { UserContext } from '@/UserContext';

import { SubmitForm, Submit } from '@/pages/Assignment/AssignmentSubmit';

export default function AssignmentDetail() {
  const { lecture_id, id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);

  const { instructor } = useContext(InstructorContext);
  const { student } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:3000/assignment/${id}`)
      .then((res) => res.json())
      .then((data) => setAssignment(data));
  }, [id]);

  const handleDownload = async () => {
    const res = await fetch(`http://localhost:3000/${assignment.file_url}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    const [, filename] = assignment.file_url.split('-', 2);
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3000/assignment/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      navigate(`/assignments/${lecture_id}`);
    } else {
      alert(data.error || '삭제 중 오류가 발생했습니다.');
    }
  };

  if (!assignment) {
    return <p className="text-center mt-10 text-gray-500">불러오는 중...</p>;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F5] flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-[#8A1601]">{assignment.title}</h2>

        <p className="text-gray-800 whitespace-pre-wrap">{assignment.content}</p>

        {assignment.file_url && (
          <div>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 bg-[#8A1601] text-white rounded hover:bg-[#a3200a] transition"
            >
              📥 파일 다운로드
            </button>
          </div>
        )}

        <p className="text-sm text-gray-500">
          게시일: {new Date(assignment.createdAt).toISOString().slice(0, 10)}
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
            onClick={() => navigate(`/assignments/${lecture_id}`)}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
          >
            목록
          </button>
        </div>

        {student && (
          <div className="flex flex-col gap-6">
            <Submit assignment_id={id} />
            <SubmitForm lecture_id={lecture_id} assignment_id={id} />
          </div>
        )}
      </div>
    </div>
  );
}
