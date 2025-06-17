import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { TeamContext } from '@/TeamContext';

export default function NoticeBoard() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [notices, setNotices] = useState([]);
  const [latestDate, setLatestDate] = useState(null);
  const { team } = useContext(TeamContext);

  const getData = async (pageNum) => {
    try {
      const res = await fetch(`http://localhost:3000/notice?page=${pageNum}`);
      const data = await res.json();
      setNotices(data);

      const latest = data.reduce((latest, item) => {
        const d = new Date(item.updatedAt).toISOString().slice(0, 10);
        return d > latest ? d : latest;
      }, '');
      setLatestDate(latest);
    } catch (err) {
      console.error('데이터 가져오기 실패:', err);
    }
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen px-4 py-10 bg-[#FFF8F5] font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#8A1601] text-center">공지사항</h1>

        {team && (
          <div className="text-right mb-6">
            <button
              className="bg-[#8A1601] text-white py-2 px-4 text-sm rounded hover:bg-[#a3200a] transition"
              onClick={() => navigate('/notice/write')}
            >
              글 쓰기
            </button>
          </div>
        )}

        <ul className="space-y-3 divide-y divide-[#E2CFC3]">
          {notices.map((notice) => {
            const updatedDate = new Date(notice.updatedAt).toISOString().slice(0, 10);
            const isNew = latestDate === updatedDate;

            return (
              <li
                key={notice.id}
                className="flex items-start justify-between gap-4 py-3 hover:bg-[#fdf5f3] px-2 rounded cursor-pointer"
                onClick={() => navigate(`/notice/${notice.id}`)}
              >
                <div className="flex flex-col w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white bg-[#8A1601] px-2 py-0.5 rounded-sm">일반</span>
                    <h2 className="text-base font-semibold text-[#8A1601] truncate">{notice.title}</h2>
                    {isNew && (
                      <span className="text-[10px] text-white bg-[#ff5e00] px-1.5 rounded-sm font-bold">N</span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 flex gap-2">
                    <span>
                      작성일 {new Date(notice.createdAt).toISOString().slice(0, 10)} | 수정일 {updatedDate}
                    </span>
                    <span>| {notice.writer || '관리자'}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                  </svg>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex justify-center items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-3 py-1 rounded border ${
              page === 1
                ? 'bg-gray-300 text-white cursor-not-allowed'
                : 'bg-[#8A1601] text-white hover:bg-[#a3200a]'
            }`}
          >
            이전
          </button>
          <span className="text-sm font-medium text-[#8A1601]">페이지 {page}</span>
          <button
            onClick={handleNext}
            className="px-3 py-1 rounded border bg-[#8A1601] text-white hover:bg-[#a3200a]"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
