import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NoticeBoard() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [notices, setNotices] = useState([]);
  const [isTeam, setIsTeam] = useState(false);

  const getData = async (pageNum) => {
    try {
      const res = await fetch(`http://localhost:3000/notice?page=${pageNum}`);
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      console.error('데이터 가져오기 실패:', err);
    }
  };

  // 공지사항 글쓰기 권한 확인
  useEffect(() => {
    //미완성

    setIsTeam(true);
  }, [])

  useEffect(() => {
    getData(page);
  }, [page]);

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>공지사항</h1>
      {isTeam && (
        <div style={styles.buttonWrapper}>
          <button
            style={styles.writeButton}
            onClick={() => navigate(`/notice/write`)}
          >
            글 쓰기
          </button>
        </div>
      )}

      <div style={styles.noticeList}>
        {notices.map((notice) => (
          <div key={notice.id} style={styles.noticeItem}>
            <button
              style={styles.titleButton}
              onClick={() => navigate(`/notice/${notice.id}`)}
            >
              {notice.title}
            </button>
            <span style={styles.date}>
              {new Date(notice.createdAt).toISOString().slice(0, 10)}
            </span>
          </div>
        ))}
      </div>

      {/* 페이지 버튼 */}
      <div style={styles.pagination}>
        <button onClick={handlePrev} disabled={page === 1}>
          이전
        </button>
        <span style={{ margin: '0 10px' }}>페이지 {page}</span>
        <button onClick={handleNext}>
          다음
        </button>
      </div>
    </div>
  );
}

const styles = {
  buttonWrapper: {
  width: "100%",
  maxWidth: "600px",
  textAlign: "right",   // 👉 오른쪽 정렬 핵심
  marginBottom: "20px",
  },
  writeButton: {
    padding: "8px 16px",
    fontSize: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "sans-serif",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  noticeList: {
    width: "100%",
    maxWidth: "600px",
  },
  noticeItem: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "10px",
    backgroundColor: "#fff",
    padding: "10px",
	display: 'flex',
  },
  titleButton: {
    background: "none",
    border: "none",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
  },
  content: {
    marginTop: "8px",
    fontSize: "15px",
    color: "#444",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: "14px",
    color: "#000000",
    marginLeft: "10px",
    whiteSpace: "nowrap"
  },
};