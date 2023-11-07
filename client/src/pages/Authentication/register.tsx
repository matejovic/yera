import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';


const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : '/api';

interface Props {
	profile: {
		id: number;
		username: string;
	}
}

export function Register (props: Props) {

  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (props.profile.id) {
    location.route('/reader');
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('LOGIN RESPONSE', data);
      window.location = '/reader';
      // handle successful login
    } catch (error) {
      console.log('LOGIN ERROR', error);
      // handle login error
    }
  };

  return (
    <div class="page">
      <h2>Register here</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}