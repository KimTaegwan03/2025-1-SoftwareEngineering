import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './UserContext';
import { InstructorProvider } from './InstructorContext';
import { TeamProvider } from './TeamContext';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <InstructorProvider>
        <TeamProvider>
          <App />
        </TeamProvider>
      </InstructorProvider>
    </UserProvider>
  </React.StrictMode>
);