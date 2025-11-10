import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'
import App from './App.jsx'

// Global event listener for unauthorized access
window.addEventListener('unauthorized', () => {
  // Clear any stale auth data
  localStorage.removeItem('authToken');
  // You could also show a notification here
  console.log('Session expired. Please log in again.');
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)