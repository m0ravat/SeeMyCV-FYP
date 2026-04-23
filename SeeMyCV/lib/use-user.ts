'use client';

import { useEffect, useState } from 'react';

export interface UserData {
  user: {
    userId: number;
    username: string;
    email: string;
    isPremium: boolean;
  };
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
    personalWebsite?: string;
    aboutMe?: string;
  };
  cv: {
    cvId: number;
    experiences: any[];
    education: any[];
    projects: any[];
    certifications: any[];
    skills: any[];
  };
}

export function useUser() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      setUserData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [refreshKey]);

  const refetch = () => {
    setRefreshKey(prev => prev + 1);
  };

  return { userData, loading, error, refetch };
}
