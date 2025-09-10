import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    // If there's an auth error (401), consider loading complete and user not authenticated
    isLoading: isLoading && !error,
    isAuthenticated: !!user,
  };
}