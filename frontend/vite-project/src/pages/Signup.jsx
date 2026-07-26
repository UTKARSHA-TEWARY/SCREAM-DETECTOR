import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    alertEmails: ['', '', '']  // ✅ Correct field name for backend
  });

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/signup', form, {
        withCredentials: true
      });
      alert('Signup success!');
      navigate('/dashboard');
    } catch (err) {
      alert('Signup failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="container">
      <div className="glass-card">
        <h2>Signup</h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        {[0, 1, 2].map(i => (
          <input
            key={i}
            placeholder={`Emergency Email ${i + 1}`}
            value={form.alertEmails[i]}
            onChange={e => {
              const emails = [...form.alertEmails];
              emails[i] = e.target.value;
              setForm({ ...form, alertEmails: emails });
            }}
          />
        ))}

        <button onClick={handleSignup}>Sign Up</button>

        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}
