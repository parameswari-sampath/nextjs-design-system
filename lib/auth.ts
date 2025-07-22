// Authentication utilities for token management
export const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshTokenValue = localStorage.getItem('refresh_token');
    if (!refreshTokenValue) {
      console.error('No refresh token found');
      return null;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshTokenValue
      })
    });

    if (response.ok) {
      const data = await response.json();
      const newAccessToken = data.access;
      
      // Update localStorage with new access token
      localStorage.setItem('access_token', newAccessToken);
      
      // Update cookies with new access token
      document.cookie = `access_token=${newAccessToken}; path=/; SameSite=Lax`;
      
      return newAccessToken;
    } else {
      console.error('Token refresh failed:', response.status);
      // If refresh fails, clear all tokens and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
      return null;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

// Enhanced fetch with automatic token refresh
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let accessToken = localStorage.getItem('access_token');
  
  if (!accessToken) {
    throw new Error('No access token available');
  }

  // Add authorization header
  const makeRequest = (token: string) => {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      }
    });
  };

  // Make the initial request
  let response = await makeRequest(accessToken);

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    console.log('Access token expired, attempting refresh...');
    
    const newAccessToken = await refreshToken();
    if (newAccessToken) {
      // Retry the request with new token
      response = await makeRequest(newAccessToken);
    }
  }

  return response;
};