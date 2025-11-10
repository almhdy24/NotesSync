import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import Notes from './components/Notes';

export default function App() {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <Notes /> : <LoginForm />;
}