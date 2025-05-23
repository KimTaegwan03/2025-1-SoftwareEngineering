// App.jsx (또는 App.tsx)
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from './Header';
import Home from "./pages/Home";
import Login from './pages/Login';
import InstLogin from './pages/InstLogin'; // 교수 로그인
import Register from './pages/Register';
import LectureForm from './pages/LectureForm';
import LectureList from './pages/LectureList';
import SyllabusDetail from './pages/SyllabusDetail';

// Notice 관련 페이지
import Notice from '@/pages/Notice/Notice'
import NoticeDetail from '@/pages/Notice/NoticeDetail'
import NoticeWrite from '@/pages/Notice/NoticeWrite'

import Announcements from '@/pages/Announcements';
import InstRegister from './pages/InstRegister'; // 교수 회원가입
import MyPage from './pages/MyPage';


import About from "./pages/About";
import InstLecture from './pages/InstLecture';
import GradeInput from "./pages/GradeInput"; // 성적 입력
import GradeView from "./pages/GradeView"; // 성적 조회
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index element={<Home />} />{/* index는 path="/"와 같음*/}
        <Route path="/login" element={<Login />} />
        <Route path="/instlogin" element={<InstLogin />} />
        <Route path="/register" element={<Register />} />

        { /* Notice 관련 페이지 */ }
        <Route path="/notice" element={<Notice/>} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="/notice/write" element={<NoticeWrite />} />
        <Route path="/instregister" element={<InstRegister />} />
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