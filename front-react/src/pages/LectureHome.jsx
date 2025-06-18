import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BsList } from 'react-icons/bs';

export default function LectureHome() {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // ... useEffect 내의 fetch 로직은 이전과 동일합니다 ...
  useEffect(() => {
    fetch(`http://localhost:3000/lecture/${lectureId}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('강의 상세를 불러올 수 없습니다.');
        return res.json();
      })
      .then(data => setLecture(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));

    fetch(`http://localhost:3000/announcement?lecture_id=${lectureId}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('강의 상세를 불러올 수 없습니다.');
        return res.json();
      })
      .then(data => setAnnouncements(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));

    fetch(`http://localhost:3000/assignment?lecture_id=${lectureId}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('강의 상세를 불러올 수 없습니다.');
        return res.json();
      })
      .then(data => setAssignments(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));

    fetch(`http://localhost:3000/question?lecture_id=${lectureId}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('강의 상세를 불러올 수 없습니다.');
        return res.json();
      })
      .then(data => setQuestions(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));

    fetch(`http://localhost:3000/data?lecture_id=${lectureId}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('강의 상세를 불러올 수 없습니다.');
        return res.json();
      })
      .then(data => setDatas(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [lectureId]);


  const utc2ko = (utcString) => {
    const date = new Date(utcString);
    const offset = date.getTimezoneOffset() * 60000;
    const kstTime = new Date(date.getTime() - offset + 9 * 60 * 60000);
    return kstTime.toISOString().slice(0, 19).replace('T', ' ');
  }

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!lecture) return <p>강의를 찾을 수 없습니다.</p>;

  return (
    <div className="min-h-screen bg-[#FFF8F5] px-4 py-10 font-sans">
      <div className="px-[310px] py-6 space-y-6">
        {/* 강의 기본 정보 */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#8A1601]">📚 {lecture.title}</h2>
          <p><strong>강의코드:</strong> {lecture.course_id} / <strong>분반:</strong> {lecture.sec_id}</p>
          <p><strong>교수:</strong> {lecture.professor}</p>
          <p><strong>학점/학기/연도:</strong> {lecture.credit}점 / {lecture.semester}학기 / {lecture.year}년</p>
          <p><strong>강의실:</strong> {lecture.building} {lecture.room_number}</p>
        </div>

        {/* 강의계획서 */}
        <div>
          <h3 className="text-xl font-semibold text-[#8A1601]">📝 강의 계획서</h3>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{lecture.content}</pre>
        </div>

        {/* 공지/과제/QnA 3단 구조 */}
        <div className="grid grid-cols-2 gap-4">

          {/* 공지사항 */}
          {/* 변경: 카드 구조를 헤더/본문으로 나누고 배경색 적용 */}
          <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
            <div className="bg-[#8A1601] p-3 flex justify-between items-center">
              <h4 className="text-lg font-semibold text-white">📢 공지사항</h4>
              <BsList
                className="text-2xl text-white cursor-pointer hover:text-gray-200"
                onClick={() => navigate(`/announcements/${lectureId}`)}
              />
            </div>
            <div className="p-4 flex-grow">
              <ul className="space-y-2 text-sm text-gray-700">
                {announcements.slice(0, 5).map(announcement => (
                  <li key={announcement.id}
                      className="cursor-pointer flex justify-between items-center"
                      onClick={() => navigate(`/announcement/${lectureId}/${announcement.id}`)}>
                    <span>• {announcement.title}</span>
                    <span className="text-gray-400">{utc2ko(announcement.createdAt).split(' ')[0]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 과제 */}
          <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
            <div className="bg-[#8A1601] p-3 flex justify-between items-center">
              <h4 className="text-lg font-semibold text-white">📝 과제</h4>
              <BsList
                className="text-2xl text-white cursor-pointer hover:text-gray-200"
                onClick={() => navigate(`/assignments/${lectureId}`)}
              />
            </div>
            <div className="p-4 flex-grow">
              <ul className="space-y-1 text-sm text-gray-700">
                {assignments.slice(0, 5).map(assignment => (
                  <li key={assignment.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/assignment/${lectureId}/${assignment.id}`)}>
                    • {assignment.title}
                    <div className="text-xs pl-2">
                      <span className="text-gray-500">기한: {utc2ko(assignment.start_dt)}</span> ~ 
                      <span className="font-semibold text-[#8A1601]"> {utc2ko(assignment.end_dt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* QnA */}
          <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
            <div className="bg-[#8A1601] p-3 flex justify-between items-center">
              <h4 className="text-lg font-semibold text-white">💬 Q&A</h4>
              <BsList
                className="text-2xl text-white cursor-pointer hover:text-gray-200"
                onClick={() => navigate(`/questions/${lectureId}`)}
              />
            </div>
            <div className="p-4 flex-grow">
              <ul className="space-y-1 text-sm text-gray-700">
                {questions.length > 0 ? (
                  questions.slice(0, 5).map(question => (
                    <li key={question.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/question/${lectureId}/${question.id}`)}>
                      • {question.title}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">질문이 없습니다.</li>
                )}
              </ul>
            </div>
          </div>

          {/* 자료실 */}
          <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
            <div className="bg-[#8A1601] p-3 flex justify-between items-center">
              <h4 className="text-lg font-semibold text-white">🗒️자료실</h4>
              <BsList
                className="text-2xl text-white cursor-pointer hover:text-gray-200"
                onClick={() => navigate(`/datas/${lectureId}`)}
              />
            </div>
            <div className="p-4 flex-grow">
              <ul className="space-y-1 text-sm text-gray-700">
                {datas.length > 0 ? (
                  datas.slice(0, 5).map(data => (
                    <li key={data.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/data/${lectureId}/${data.id}`)}>
                      • {data.title}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">질문이 없습니다.</li>
                )}
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}