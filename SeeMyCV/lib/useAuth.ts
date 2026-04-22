import { useEffect, useState } from 'react';

interface User {
  user_id: number;
  username: string;
  isPremium: boolean;
  created_at: string;
  last_login: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Session fetch error:', err);
        setError('Failed to fetch session');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    }
  };

  return { user, loading, error, logout };
}
