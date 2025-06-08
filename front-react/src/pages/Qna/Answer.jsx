import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { InstructorContext } from '@/InstructorContext';
import { UserContext } from '@/UserContext';

export function AnswerList({ question_id }) {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState([]);

  const getData = async (pageNum) => {
    try {
      // 서버 주소 아직 미정
      const res = await fetch(`http://localhost:3000/answer?question_id=${question_id}&page=${pageNum}`);
      const data = await res.json();
      setAnswers(data);
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
    <div style={styles.container}>
      <h1 style={styles.heading}>답글</h1>

      <div style={styles.noticeList}>
        {answers.map((answer) => (
          <div key={answer.id} style={styles.noticeItem}>
            <p>{answer.content}</p>
            <span style={styles.date}>
              {new Date(answer.createdAt).toISOString().slice(0, 10)}
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

export function AnswerForm({ question_id }) {
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/answer/write?question_id=${question_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
        credentials: 'include', // 세션 인증이 필요한 경우
      });

      if (res.ok) {
        const result = await res.json();
        setContent('');
      } else {
        alert('답변 등록 실패');
      }
      navigate(0);
    } catch (err) {
      console.error(err);
      alert('오류 발생');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <textarea
        placeholder="답변 내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 rounded"
        rows={4}
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        답변 등록
      </button>
    </form>
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