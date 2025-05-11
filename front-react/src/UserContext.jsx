import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/auth/session', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) setStudent(data.student);
      });
  }, []);

  return (
    <UserContext.Provider value={{ student, setStudent }}>
      {children}
    </UserContext.Provider>
  );
}
