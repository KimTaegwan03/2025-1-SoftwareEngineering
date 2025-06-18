import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ReviewList() {
  const { lectureId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [lecture, setLecture] = useState(null);
  const navigate = useNavigate();
  const averageRating = reviews.length
  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  : null;


  useEffect(() => {
    // 강의 정보
    fetch(`http://localhost:3000/lecture/${lectureId}`, { credentials: 'include' })
      .then(r => r.json())
      .then(setLecture)
      .catch(console.error);

    // 리뷰 목록
    fetch(`http://localhost:3000/reviews/${lectureId}`, { credentials: 'include' })
      .then(r => r.json())
      .then(setReviews)
      .catch(console.error);
  }, [lectureId]);

  if (!lecture) return <p className="text-center py-8 text-gray-600">강의 정보 불러오는 중…</p>;

  return (
    <div className="min-h-screen bg-[#FFF8F5] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-[#8A1601] rounded-lg shadow p-6">
        {averageRating && (
  <div className="text-lg font-semibold text-[#8A1601] mb-2">
    평균 별점: ⭐ {averageRating} / 5
  </div>
)}

        <h2 className="text-2xl font-bold text-[#8A1601] mb-4">{lecture.title} — 리뷰 목록</h2>

        <div className="mb-6 text-right">
          <button
            onClick={() => navigate(`/lecture/${lectureId}/review/new`)}
            className="bg-[#8A1601] text-white px-4 py-2 rounded hover:bg-[#6c1100] transition"
          >
            ▶ 리뷰 작성하기
          </button>
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">등록된 리뷰가 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map(r => (
              <li
                key={r.id}
                className="border border-gray-200 rounded-md p-4 shadow-sm bg-[#FAFAFA]"
              >
                <p className="text-lg font-semibold text-yellow-600">⭐ {r.rating} / 5</p>
                <p className="mt-1 text-gray-800">{r.comment}</p>
                <p className="mt-1 text-sm text-gray-500">by {r.studentName}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
