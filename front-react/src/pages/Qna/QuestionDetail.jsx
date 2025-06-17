import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { InstructorContext } from '@/InstructorContext';
import { UserContext } from '@/UserContext';

import { AnswerList, AnswerForm } from '@/pages/Qna/Answer';

export default function QuestionDetail() {
  const { lecture_id, question_id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);

  const { instructor } = useContext(InstructorContext);
  const { student } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:3000/question/${question_id}`)
      .then((res) => res.json())
      .then((data) => setQuestion(data));
  }, [question_id]);

  if (!question) return <p className="text-center mt-10 text-gray-500">불러오는 중...</p>;

  return (
    <div className="flex flex-col items-center py-10 px-4 bg-[#FFF8F5] min-h-screen font-sans">
      {/* 질문 본문 */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow border border-[#D9B6AE] mb-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#8A1601]">Q. {question.title}</h2>
        <p className="text-gray-800 mb-6 text-center whitespace-pre-wrap">{question.content}</p>

        {question.file_url && (
          <div className="flex justify-center mb-6">
            <img
              src={`http://localhost:3000/${question.file_url}`}
              alt="질문 이미지"
              className="max-w-full max-h-[400px] border rounded"
              onError={(e) => {
                e.target.src = '';
                alert('이미지를 불러올 수 없습니다.');
              }}
            />
          </div>
        )}

        <p className="text-sm text-right text-gray-500">
          게시일: {new Date(question.createdAt).toISOString().slice(0, 10)}
        </p>
      </div>

      {/* 답변 목록 */}
      <div className="w-full max-w-2xl bg-white p-5 rounded-lg shadow border border-[#D9B6AE] mb-6">
        <h3 className="text-lg font-semibold mb-3 text-[#8A1601]">💬 답변 목록</h3>
        <AnswerList question_id={question_id} />
      </div>

      {/* 답변 작성 */}
      {instructor && (
        <div className="w-full max-w-2xl bg-white p-5 rounded-lg shadow border border-[#D9B6AE]">
          <h3 className="text-lg font-semibold mb-3 text-[#8A1601]">✍ 답변 작성</h3>
          <AnswerForm question_id={question_id} />
        </div>
      )}
    </div>
  );
}
