import React, { useState } from 'react';
// Import updateProfile along with createUserWithEmailAndPassword
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  // Add a loading state for better UX
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    // Don't allow multiple submissions while one is processing
    if (loading) return;

    // Basic validation (optional but recommended)
    if (!fullName.trim()) {
        setMessage('Please enter your full name.');
        return;
    }

    setLoading(true); // Set loading state

    try {
      // 1. Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update the user's profile with the displayName
      // Make sure fullName state variable holds the correct value from the input
      await updateProfile(user, {
        displayName: fullName
      });

      console.log("User profile updated with displayName:", fullName);

      // Account created and profile updated successfully!
      setMessage('Account created successfully!');
      setLoading(false); // Reset loading state

      // Navigate after a short delay
      // Consider navigating immediately or showing a success state before navigating
      setTimeout(() => navigate('/dashboard'), 1500); // Navigate to dashboard or home as preferred

    } catch (error) {
      console.error("Signup Error:", error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setMessage('This email is already in use.');
          break;
        case 'auth/invalid-email':
          setMessage('Invalid email address format.');
          break;
        case 'auth/weak-password':
          setMessage('Password should be at least 6 characters long.');
          break;
        default:
          // Generic error message for other Firebase or network issues
          setMessage('Failed to create account. Please try again.');
          // Optionally log error.message for debugging: console.error(error.message);
      }
      setLoading(false); // Reset loading state on error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <FileText className="mx-auto text-blue-600 w-10 h-10" />
          <h2 className="mt-2 text-2xl font-extrabold text-blue-600">Meetings-360</h2>
          <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">Create a new account</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              sign in to your account
            </Link>
          </p>
        </div>

        {message && (
          // Conditional styling for success/error messages
          <div className={`text-center text-sm font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full name"
            value={fullName} // Controlled component
            className="block w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading} // Disable input while loading
          />
          <input
            type="email"
            placeholder="Email address"
            value={email} // Controlled component
            className="block w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading} // Disable input while loading
          />
          <input
            type="password"
            placeholder="Password"
            value={password} // Controlled component
            className="block w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading} // Disable input while loading
          />
          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;