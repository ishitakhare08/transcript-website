// Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Logged in successfully!');
      setTimeout(() => navigate('/dashboard'), 1000); // ✅ now redirects to /dashboard
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setMessage('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setMessage('Incorrect password.');
          break;
        case 'auth/invalid-email':
          setMessage('Invalid email format.');
          break;
        default:
          setMessage(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <FileText className="mx-auto text-blue-600 w-10 h-10" />
          <h2 className="mt-2 text-2xl font-extrabold text-blue-600">Meetings-360</h2>
          <h3 className="mt-2 text-xl font-bold text-gray-900">Sign in to your account</h3>
          <p className="mt-1 text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              create a new account
            </Link>
          </p>
        </div>

        {message && (
          <div className="text-center text-sm text-red-500 font-medium">{message}</div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot your password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
