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

// Notice 관련 페이지
import Notice from '@/pages/Notice/Notice'
import NoticeDetail from '@/pages/Notice/NoticeDetail'
import NoticeWrite from '@/pages/Notice/NoticeWrite'

import Announcements from '@/pages/Announcements';
import About from "./pages/About";
import NotFound from "./pages/NotFound";
export default function App() {
  return (
    <BrowserRouter>
      <Header/>

      <Routes>
        <Route index element={<Home />} />{/* index는 path="/"와 같음*/}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        { /* Notice 관련 페이지 */ }
        <Route path="/notice" element={<Notice/>} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="/notice/write" element={<NoticeWrite />} />

        <Route path="/announcements" element={<Announcements/>} />

        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}