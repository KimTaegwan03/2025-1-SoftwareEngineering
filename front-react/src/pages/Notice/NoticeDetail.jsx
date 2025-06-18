import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [latestDate, setLatestDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3000/notice`);
      const all = await res.json();
      const latest = all.reduce((latest, item) => {
        const d = new Date(item.updatedAt).toISOString().slice(0, 10);
        return d > latest ? d : latest;
      }, '');
      setLatestDate(latest);

      const res2 = await fetch(`http://localhost:3000/notice/${id}`);
      const data = await res2.json();
      setNotice(data);
    };

    fetchData();
  }, [id]);

  if (!notice) return <p className="text-center mt-10 text-gray-500">불러오는 중...</p>;

  const updatedDate = new Date(notice.updatedAt).toISOString().slice(0, 10);
  const isNew = latestDate === updatedDate;

  return (
    // ✅ 전체 배경 영역
    <div className="min-h-screen bg-[#FFF8F5] font-sans">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* 공지 내용 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-white bg-[#8A1601] px-2 py-0.5 rounded-sm">일반</span>
            <h2 className="text-lg sm:text-xl font-bold text-[#8A1601] flex items-center gap-1">
              {notice.title}
              {isNew && (
                <span className="text-[10px] text-white bg-[#ff5e00] px-1.5 rounded-sm font-bold">N</span>
              )}
            </h2>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            작성일 {new Date(notice.createdAt).toISOString().slice(0, 10)} | 수정일 {updatedDate} | {notice.writer || '관리자'}
          </div>

          {notice.image_url && (
            <div className="mb-6 h-96">
              <img
                src={`http://localhost:3000${notice.image_url}`}
                alt="공지 이미지"
                className="rounded-lg w-full h-full border object-contain"
              />
            </div>
          )}

          <div className="prose max-w-none text-gray-800 text-sm whitespace-pre-wrap">
            {notice.content}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              className="bg-[#8A1601] text-white px-6 py-2 rounded hover:bg-[#6c1100]"
              onClick={() => navigate('/notice')}
            >
              목록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
