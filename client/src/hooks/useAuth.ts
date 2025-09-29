import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
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
          throw new Error('Failed to fetch user');
        }
        return response.json();
      } catch (error) {
        console.error('Auth error:', error);
        return null;
      }
    },
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}