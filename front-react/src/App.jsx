// App.jsx (또는 App.tsx)
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '@/UserContext';
import { InstructorContext } from '@/InstructorContext';
import { TeamContext } from '@/TeamContext';

import Header from '@/Header';
import Home from "@/pages/Home/Home";
import StudentHome from "@/pages/Home/StudentHome";
import InstructorHome from "@/pages/Home/InstructorHome";
import TeamHome from "@/pages/Home/TeamHome";

// 회원가입
import Register from '@/pages/Register/Register'; // 학생 회원가입
import InstRegister from '@/pages/Register/InstRegister'; // 교수 회원가입
import TeamRegister from '@/pages/Register/TeamRegister' // 교학팀 회원가입

// 로그인
import Login from '@/pages/Login/Login';

// Notice 관련 페이지
import Notice from '@/pages/Notice/Notice'
import NoticeDetail from '@/pages/Notice/NoticeDetail'
import NoticeWrite from '@/pages/Notice/NoticeWrite'

// Announcement 관련 페이지
import Announcement from '@/pages/Announcement/Announcement';
import AnnouncementDetail from '@/pages/Announcement/AnnouncementDetail';
import AnnouncementWrite from '@/pages/Announcement/AnnouncementWrite';

// Assignment 관련 페이지
import Assignment from '@/pages/Assignment/Assignment';
import AssignmentDetail from '@/pages/Assignment/AssignmentDetail';
import AssignmentWrite from '@/pages/Assignment/AssignmentWrite';

// Q&A 관련 페이지
import Question from '@/pages/Qna/Question';
import QuestionDetail from '@/pages/Qna/QuestionDetail';
import QuestionWrite from '@/pages/Qna/QuestionWrite';

import MyPage from './pages/MyPage';

import LectureForm from './pages/LectureForm';
import LectureList from './pages/LectureList';
import SyllabusDetail from './pages/SyllabusDetail';

import EnrollPage from './pages/EnrollPage';
import Timetable from './pages/Timetable';

import InstLecture from './pages/InstLecture';
import GradeInput from "./pages/GradeInput"; // 성적 입력
import GradeView from "./pages/GradeView"; // 성적 조회
import AttendancePage from './pages/AttendancePage';

import About from "./pages/About";
import NotFound from "./pages/NotFound";


import ProfLectureList from './pages/ProfLectureList';
import LectureStats     from './pages/LectureStats';



export default function App() {  
  const { student, setStudent  } = useContext(UserContext);
  const { instructor, setInstructor  } = useContext(InstructorContext);
  const { team, setTeam  } = useContext(TeamContext);
  return (
    <BrowserRouter>
      <Header />
      {/* 학생 교수 교학처에 따라 홈페이지를 다르게 렌더링 */}
      <Routes>
        {
          student ? (
            <Route index element={<StudentHome />} />
          ) : (
            instructor ? (
              <Route index element={<InstructorHome />} />
            ) : (
              team ? (
                <Route index element={<TeamHome />} />
              ) : (
                <Route index element={<Login />} />
              )
            )
          )
        }
        
        {/* 회원가입 및 로그인 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/instregister" element={<InstRegister />} />
        <Route path="/teamregister" element={<TeamRegister />} />

        { /* Notice 관련 페이지 */ }
        <Route path="/notice" element={<Notice/>} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="/notice/write" element={<NoticeWrite />} />

        { /* Announcement 관련 페이지 */ }
        <Route path="/announcements/:lecture_id" element={<Announcement />} />
        <Route path="/announcement/:lecture_id/:id" element={<AnnouncementDetail />} />
        <Route path="/announcement/:lecture_id/write" element={<AnnouncementWrite />} />
        
        { /* Assignment 관련 페이지 */ }
        <Route path="/assignments/:lecture_id" element={<Assignment />} />
        <Route path="/assignment/:lecture_id/:id" element={<AssignmentDetail />} />
        <Route path="/assignment/:lecture_id/write" element={<AssignmentWrite />} />

        { /* Q&A 관련 페이지 */ }
        <Route path="/questions/:lecture_id" element={<Question />} />
        <Route path="/question/:lecture_id/:question_id" element={<QuestionDetail />} />
        <Route path="/question/:lecture_id/write" element={<QuestionWrite />} />
        
        <Route path="/mypage" element={<MyPage />} />
        { /* 교수 강의 목록 */}
        <Route path="/instructor/lectures" element={<InstLecture />} />
        { /* 교수 강의 통계 */}
        <Route path="/instructor/lectures/:lectureId/stats" element={<LectureStats />} />
        <Route path="/gradeinput/:lectureId" element={<GradeInput />} />
        <Route path="/grades" element={<GradeView />} />
        
        {/* 강의페이지추가 */}
        <Route path="/lecture" element={<LectureForm />} />
        <Route path="/lectures" element={<LectureList />} />
        <Route path="/syllabus/:lectureId" element={<SyllabusDetail />} />
        <Route path="/enroll" element={<EnrollPage />} />  
        <Route path="/timetable" element={<Timetable />} />     
        {/* <Route path="/mypage" element={<MyPage />} /> */}

        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}