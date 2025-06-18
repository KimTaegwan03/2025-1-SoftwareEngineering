import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ReviewForm() {
  const { lectureId } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/reviews/${lectureId}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment })
    });

    if (res.ok) {
      navigate(`/lecture/${lectureId}/reviews`);
    } else {
      const { error } = await res.json();
      alert(error || '리뷰 등록에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F5] py-12 px-4">
      <div className="max-w-xl mx-auto bg-white border border-[#8A1601] rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-[#8A1601] mb-6 text-center">리뷰 작성</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="rating" className="block text-[#8A1601] font-medium mb-1">
              평가 (별점)
            </label>
            <select
              id="rating"
              value={rating}
              onChange={e => setRating(+e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}점</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="comment" className="block text-[#8A1601] font-medium mb-1">
              한줄평
            </label>
            <textarea
              id="comment"
              rows="4"
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
              placeholder="리뷰 내용을 입력하세요"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#8A1601] text-white px-6 py-2 rounded hover:bg-[#6c1100] transition"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
