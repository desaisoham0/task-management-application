import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      alert('Registration failed');
    }
  };


  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{maxWidth: '400px'}}>
        <h2 className="h2 mb-4">Register</h2>
        {isSuccess && (
          <div className="alert alert-success mb-3" role="alert">
            Registration successful! Redirecting to login...
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
          </div>
          <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-success"
          >
            Register
          </button>
          <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
