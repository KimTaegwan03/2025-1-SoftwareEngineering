// App.jsx (또는 App.tsx)
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from './Header';
import Home from "./pages/Home";
// import MyPage from './MyPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Announcements from './pages/Announcements';
import About from "./pages/About";
import NotFound from "./pages/NotFound";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />{/* index는 path="/"와 같음*/}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 강의페이지추가 */}
          <Route path="/lecture" element={<LectureForm />} />
          <Route path="/lectures" element={<LectureList />} />
          <Route path="/syllabus/:lectureId" element={<SyllabusDetail />} />
           {/* <Route path="/enroll" element={<EnrollPage />} />  
           <Route path="/timetable" element={<Timetable />} />      */}
        <Route path="/mypage" element={<MyPage />} />

        <Route path="/announcements" element={<Announcements/>} />

        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}