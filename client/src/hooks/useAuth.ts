import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/user");
        if (!response.ok) {
          if (response.status === 401) {
            return null; // Not authenticated
          }
          throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
      } catch (err) {
        // Return null for any auth errors to indicate not authenticated
        return null;
      }
    },
    retry: false,
  });

  return {
    user,
    // If there's an auth error (401), consider loading complete and user not authenticated
    isLoading: isLoading && !error,
    isAuthenticated: !!user,
  };
}