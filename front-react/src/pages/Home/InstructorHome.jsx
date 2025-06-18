import  { React, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InstructorContext } from '@/InstructorContext';
import './StudentHome.css';

export default function InstructorHome() {
  const { instructor } = useContext(InstructorContext);

  return (
    <div className="home-container">

      <main className="home-grid">
        {/* 1. 프로필 카드 */}
        <section className="profile-card">
          <div className="profile-pic"></div>
          <div className="profile-info">
            <strong>{instructor.name}</strong>
            <div>{String(instructor.ID).padStart(10, '0')}</div>
            <div>{instructor.dept_name}</div>
          </div>
        </section>
      </main>
    </div>
  );
}