// src/TeamContext.jsx
import { createContext, useState, useEffect } from 'react';

export const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [team, setTeam] = useState(null);

  useEffect(() => {
	fetch('http://localhost:3000/auth/session', {
	  credentials: 'include'
	})
	  .then(res => res.json())
	  .then(data => {
		if (data.loggedIn) setTeam(data.team);
		console.log(data.team);
	  });
  }, []);

  return (
	<TeamContext.Provider value={{ team, setTeam }}>
	  {children}
	</TeamContext.Provider>
  );
}
