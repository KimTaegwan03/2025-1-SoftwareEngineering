import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import clsx from 'clsx';

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
	<input
	  ref={ref}
	  className={clsx(
		'w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
		className
	  )}
	  {...props}
	/>
  );
});

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch('/api/announcements');
        const data = await res.json();
        setAnnouncements(data);
      } catch {
        setAnnouncements([
          { id: 1, title: '서비스 점검 안내', date: '2025-05-20' },
          { id: 2, title: '신규 기능 업데이트', date: '2025-05-15' },
          { id: 3, title: '봄맞이 이벤트', date: '2025-05-01' },
        ]);
      }
    }
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const lower = query.toLowerCase();
    setFiltered(
      announcements.filter(a => a.title.toLowerCase().includes(lower))
    );
  }, [query, announcements]);

  const sortedAnnouncements = [...filtered].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">공지사항</h1>
        <Input
          placeholder="검색어를 입력하세요..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="mb-6 w-full"
        />

        <div className="space-y-3">
          {sortedAnnouncements.map(item => (
            <button
              key={item.id}
              onClick={() => window.location.href = `/announcements/${item.id}`}
              className="w-full text-left p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="font-semibold text-lg">{item.title}</div>
              <div className="text-sm text-gray-500">{format(new Date(item.date), 'yyyy.MM.dd')}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPage;
