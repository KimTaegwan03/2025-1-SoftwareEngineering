import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { InstructorContext } from '@/InstructorContext';
import { UserContext } from '@/UserContext';

export default function Question() {
  const { lecture_id } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const { instructor, setInstructor  } = useContext(InstructorContext);
  const { student, setStudent  } = useContext(UserContext);

  const getData = async (pageNum) => {
    try {
      // 서버 주소 아직 미정
      const res = await fetch(`http://localhost:3000/question?lecture_id=${lecture_id}?page=${pageNum}`);
      const data = await res.json();
      setQuestions(data);
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
      <h1 style={styles.heading}>질문</h1>
      {student && (
        <div style={styles.buttonWrapper}>
          <button
            style={styles.writeButton}
            onClick={() => navigate(`/question/${lecture_id}/write`)}
          >
            글 쓰기
          </button>
        </div>
      )}

      <div style={styles.noticeList}>
        {questions.map((question) => (
          <div key={question.id} style={styles.noticeItem}>
            <button
              style={styles.titleButton}
              onClick={() => navigate(`/question/${lecture_id}/${question.id}`)}
            >
              {question.title}
            </button>
            <span style={styles.date}>
              {new Date(question.createdAt).toISOString().slice(0, 10)}
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