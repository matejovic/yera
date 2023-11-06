import { useEffect } from 'preact/hooks';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : '/api';

const Logout = () => {
  useEffect(() => {
    fetch(API_URL + '/auth/logout', {
      credentials: 'include',
      method: 'POST',
    
    }).then(() => {
      window.location = '/';
    });
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;