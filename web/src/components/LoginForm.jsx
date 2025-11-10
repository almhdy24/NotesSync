import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const { login, register } = useAuth();

  // Real-time validation
  useEffect(() => {
    const newErrors = { email: '', password: '' };

    // Email validation
    if (touched.email) {
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!isValidEmail(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Password validation
    if (touched.password) {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 4) {
        newErrors.password = 'Password must be at least 4 characters';
      } else if (password.length > 72) {
        newErrors.password = 'Password is too long';
      }
    }

    setErrors(newErrors);
  }, [email, password, touched]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show all errors
    setTouched({ email: true, password: true });
    
    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      setError('Please fix the validation errors above');
      return;
    }

    // Check basic requirements
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    const result = isLogin
      ? await login(email, password)
      : await register(email, password);

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const isFormValid = () => {
    return email && 
           password && 
           password.length >= 4 && 
           isValidEmail(email) &&
           !Object.values(errors).some(error => error !== '');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg border-0" style={{ width: '400px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <i className="bi bi-journal-text display-4 text-primary mb-3"></i>
            <h2 className="card-title">NoteSync</h2>
            <p className="text-muted">Your notes, synchronized everywhere</p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                disabled={loading}
                required
              />
              {errors.email && touched.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                disabled={loading}
                required
                minLength="4"
                maxLength="72"
              />
              {errors.password && touched.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
              <div className="form-text">
                Password must be at least 4 characters long
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link text-decoration-none"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setErrors({ email: '', password: '' });
                setTouched({ email: false, password: false });
              }}
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}