import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamContext } from '@/TeamContext';

export default function NoticeWrite() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const { team } = useContext(TeamContext);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('writer', team.name);
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const response = await fetch('http://localhost:3000/notice/write', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('공지사항이 등록되었습니다.');
        navigate('/notice');
      } else {
        alert('등록 실패');
      }
    } catch (error) {
      console.error('에러:', error);
      alert('서버 오류');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-[#8A1601] mb-6">공지사항 작성</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <div>
            <label className="block font-medium mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A1601]"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="10"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A1601]"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">이미지 업로드</label>

            {/* 숨겨진 파일 input */}
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* 예쁜 업로드 버튼 */}
            <label
              htmlFor="imageUpload"
              className="inline-block px-4 py-2 bg-[#8A1601] text-white rounded cursor-pointer hover:bg-[#a3200a] transition"
            >
              이미지 선택
            </label>

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="미리보기"
                  className="w-full max-h-72 object-contain bg-gray-100 rounded"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#8A1601] text-white px-6 py-2 rounded hover:bg-[#a3200a] transition"
          >
            등록
          </button>
        </form>
      </div>
    </div>
  );
}
