import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        if (!response.ok) {
          if (response.status === 401) {
            return null;
          }
          throw new Error(`Auth failed: ${response.status}`);
        }
        const userData = await response.json();
        if (!userData) {
          throw new Error('Invalid user data received');
        }
        return userData;
      } catch (error) {
        console.error('Auth error:', error);
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user && !error,
    error: error?.message || null,
  };
}