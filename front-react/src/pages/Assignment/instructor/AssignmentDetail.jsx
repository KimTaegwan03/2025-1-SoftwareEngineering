import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AssignmentDetail() {
  const { lecture_id, id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    // 과제 정보 가져오기
    fetch(`http://localhost:3000/assignment/${id}`)
      .then((res) => res.json())
      .then((data) => setAssignment(data));

    // 제출된 과제 리스트 가져오기
    fetch(`http://localhost:3000/assignment/submit/all/${id}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setSubmissions(data));
  }, [id]);

  const utc2ko = (utcString) => {
    const date = new Date(utcString);
    const offset = date.getTimezoneOffset() * 60000;
    const kstTime = new Date(date.getTime() - offset + 9 * 60 * 60000);
    return kstTime.toISOString().slice(0, 19).replace('T', ' ');
  };

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
    <div className="min-h-screen bg-[#FFF8F5] px-4 py-12 font-sans">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-[#8A1601] border-b pb-2">과제 정보</h2>

          <table className="table-auto w-full border border-gray-300 text-sm mt-4">
            <tbody>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2 w-32">제목</th>
                <td className="px-4 py-2">{assignment.title}</td>
              </tr>
              <tr>
                <th className="text-left px-4 py-2 bg-gray-50">제출기한</th>
                <td className="px-4 py-2">
                  {utc2ko(assignment.start_dt)} ~ {utc2ko(assignment.end_dt)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2">내용</th>
                <td className="px-4 py-2 whitespace-pre-wrap text-gray-800">
                  {assignment.content}
                </td>
              </tr>
              <tr>
                <th className="text-left px-4 py-2 bg-gray-50">첨부파일</th>
                <td className="px-4 py-2">
                  {assignment.file_url ? (
                    <button
                      onClick={handleDownload}
                      className="bg-[#8A1601] text-white px-4 py-1 rounded hover:bg-[#a3200a] transition"
                    >
                      📥 다운로드
                    </button>
                  ) : (
                    '없음'
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              과제 삭제
            </button>
            <button
              onClick={() => navigate(`/assignments/${lecture_id}`)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
            >
              목록으로
            </button>
          </div>
        </div>

        {/* 제출 목록 영역 */}
        <div>
          <h3 className="text-xl font-semibold text-[#8A1601] border-b pb-2">제출한 학생 목록</h3>

          {submissions.length === 0 ? (
            <p className="text-gray-500 mt-3">아직 제출한 학생이 없습니다.</p>
          ) : (
            <table className="w-full text-sm border mt-4">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="py-2 px-3 border">번호</th>
                  <th className="py-2 px-3 border">학생 이름</th>
                  <th className="py-2 px-3 border">제목</th>
                  <th className="py-2 px-3 border">제출일</th>
                  <th className="py-2 px-3 border">파일</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, idx) => (
                  <tr key={s.id} className="text-center border-t">
                    <td className="py-2 px-3">{idx + 1}</td>
                    <td className="py-2 px-3">{s.student_id || '-'}</td>
                    <td className="py-2 px-3">{s.title}</td>
                    <td className="py-2 px-3">{utc2ko(s.updatedAt)}</td>
                    <td className="py-2 px-3">
                      {s.file_url ? (
                        <a
                          href={`http://localhost:3000/public/${s.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          다운로드
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
