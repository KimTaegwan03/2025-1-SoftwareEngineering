// src/InstructorContext.jsx
import { createContext, useState, useEffect } from 'react';

export const InstructorContext = createContext();

export function InstructorProvider({ children }) {
  const [instructor, setInstructor] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/auth/session', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) setInstructor(data.instructor);
      });
  }, []);

  return (
    <InstructorContext.Provider value={{ instructor, setInstructor }}>
      {children}
    </InstructorContext.Provider>
  );
}
