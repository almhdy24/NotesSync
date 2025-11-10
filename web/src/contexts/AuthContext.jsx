import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate token and get user info on app start
  const validateAndGetUser = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Set the token for the request
      apiClient.setToken(token);
      
      // Get actual user info from server
      const result = await apiClient.getUserInfo();
      
      if (result.success) {
        setUser(result.user);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('authToken');
        apiClient.setToken(null);
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      apiClient.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateAndGetUser();
  }, []);

  const login = async (email, password) => {
    // Client-side validation
    const validationError = validateLoginData(email, password);
    if (validationError) {
      return { success: false, error: validationError };
    }

    try {
      const result = await apiClient.login(email, password);
      if (result.success) {
        apiClient.setToken(result.token);
        setUser(result.user); // Set the actual user from server response
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password) => {
    // Client-side validation
    const validationError = validateRegisterData(email, password);
    if (validationError) {
      return { success: false, error: validationError };
    }

    try {
      const result = await apiClient.register(email, password);
      if (result.success) {
        // Auto-login after registration
        return await login(email, password);
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    apiClient.setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Client-side validation functions
function validateLoginData(email, password) {
  if (!email || !password) {
    return 'Email and password are required';
  }

  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }

  if (password.length < 4) {
    return 'Password must be at least 4 characters long';
  }

  return null;
}

function validateRegisterData(email, password) {
  const loginValidation = validateLoginData(email, password);
  if (loginValidation) {
    return loginValidation;
  }

  if (password.length > 72) {
    return 'Password is too long';
  }

  if (email.length > 255) {
    return 'Email is too long';
  }

  return null;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}