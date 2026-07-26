import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://scream-detector.onrender.com/api/auth/login', {
        email, password
      }, { withCredentials: true });

      alert('Login success!');
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed: ' + err.response?.data?.error);
    }
  };

  return (
    <div className="container">
      <div className="glass-card">
        <h2>Login</h2>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
}
