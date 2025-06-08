import  { React, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InstructorHome() {
  const navigate = useNavigate();
  return (
    <>
      <h1>교수 페이지임</h1>
      <button onClick={() => navigate('/instructor/lectures')}>내 강의 목록</button>
    </>
  );
}