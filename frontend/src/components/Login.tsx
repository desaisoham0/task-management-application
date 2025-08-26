import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = await login(username, password);
      localStorage.setItem('token', token);
      window.location.href = '/';
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{maxWidth: '400px'}}>
        <h2 className="h2 mb-4">Login</h2>
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div >
          <div className="d-flex gap-2">
            <button 
              type="submit"
              className="btn btn-primary"
            >
              Login
            </button>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
