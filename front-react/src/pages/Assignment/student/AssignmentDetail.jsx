import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import { SubmitForm, Submit } from '@/pages/Assignment/student/AssignmentSubmit';

export default function AssignmentDetail() {
  const { lecture_id, id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/assignment/${id}`)
      .then((res) => res.json())
      .then((data) => setAssignment(data));
  }, [id]);

  const utc2ko = (utcString) => {
    const date = new Date(utcString);
    const offset = date.getTimezoneOffset() * 60000;
    const kstTime = new Date(date.getTime() - offset + 9 * 60 * 60000);
    
    // "2025-06-17 15:00:00" 형식
    return kstTime.toISOString().slice(0, 19).replace('T', ' ');
  }

  const handleDownload = async () => {
    const res = await fetch(`http://localhost:3000/${assignment.file_url}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const [, filename] = assignment.file_url.split('-', 2);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (!assignment) {
    return <p className="text-center mt-10 text-gray-500">불러오는 중...</p>;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F5] px-4 py-10 font-sans">
      <div className="w-full max-w-4xl mx-auto bg-white rounded shadow-md p-6 space-y-8">
        <h2 className="text-2xl font-bold text-[#8A1601] border-b pb-2">과제 정보</h2>

        <table className="table-auto w-full border border-gray-300 text-sm">
          <tbody>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2 w-32">제목</th>
              <td className="px-4 py-2">{assignment.title}</td>
            </tr>
            <tr>
              <th className="text-left px-4 py-2 bg-gray-100">제출기한</th>
              <td className="px-4 py-2">
                {utc2ko(assignment.start_dt)} ~ {utc2ko(assignment.end_dt)}
              </td>
            </tr>
            <tr>
              <th className="text-left px-4 py-2 bg-gray-100">상태</th>
              <td className="px-4 py-2">-</td>
            </tr>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">내용</th>
              <td className="px-4 py-2 whitespace-pre-wrap text-gray-800">
                {assignment.content}
              </td>
            </tr>
            <tr>
                <th className="text-left px-4 py-2 bg-gray-100">첨부파일</th>
                <td className="px-4 py-2">
                  {assignment.file_url ? (
                    <button
                      onClick={handleDownload}
                      className="bg-[#8A1601] text-white px-4 py-1 rounded hover:bg-[#a3200a] transition"
                    >
                      📥 다운로드
                    </button>
                  ) : ''}
                </td>
              </tr>
          </tbody>
        </table>

        <Submit assignment_id={id} />
        <SubmitForm lecture_id={lecture_id} assignment_id={id} />
      </div>
    </div>
  );
}