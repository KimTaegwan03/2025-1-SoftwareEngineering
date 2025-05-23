// App.jsx (또는 App.tsx)
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from './Header';
import Home from "./pages/Home";

// 로그인
import Register from '@/pages/Register/Register'; // 학생 회원가입
import InstRegister from '@/pages/Register/InstRegister'; // 교수 회원가입
import TeamRegister from '@/pages/Register/TeamRegister' // 교학팀 회원가입

// 회원가입
import Login from '@/pages/Login/Login'; // 학생 로그인
import InstLogin from '@/pages/Login/InstLogin'; // 교수 로그인
import TeamLogin from '@/pages/Login/TeamLogin' // 교학팀 로그인

// Notice 관련 페이지
import Notice from '@/pages/Notice/Notice'
import NoticeDetail from '@/pages/Notice/NoticeDetail'
import NoticeWrite from '@/pages/Notice/NoticeWrite'

import Announcements from '@/pages/Announcements';
import MyPage from './pages/MyPage';

import LectureForm from './pages/LectureForm';
import LectureList from './pages/LectureList';
import SyllabusDetail from './pages/SyllabusDetail';

import InstLecture from './pages/InstLecture';
import GradeInput from "./pages/GradeInput"; // 성적 입력
import GradeView from "./pages/GradeView"; // 성적 조회

import About from "./pages/About";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index element={<Home />} />{/* index는 path="/"와 같음 */}

        {/* 회원가입 및 로그인 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/instlogin" element={<InstLogin />} />
        <Route path="/instregister" element={<InstRegister />} />
        <Route path="/teamlogin" element={<TeamLogin />} />
        <Route path="/teamregister" element={<TeamRegister />} />

        { /* Notice 관련 페이지 */ }
        <Route path="/notice" element={<Notice/>} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="/notice/write" element={<NoticeWrite />} />
        
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/instructor/lectures" element={<InstLecture />} />
        <Route path="/gradeinput/:lectureId" element={<GradeInput />} />
        <Route path="/grades" element={<GradeView />} />
        {/* 강의페이지추가 */}
        <Route path="/lecture" element={<LectureForm />} />
        <Route path="/lectures" element={<LectureList />} />
        <Route path="/syllabus/:lectureId" element={<SyllabusDetail />} />
        {/* <Route path="/enroll" element={<EnrollPage />} />  
        <Route path="/timetable" element={<Timetable />} />      */}
        {/* <Route path="/mypage" element={<MyPage />} /> */}

        <Route path="/announcements" element={<Announcements/>} />

        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}