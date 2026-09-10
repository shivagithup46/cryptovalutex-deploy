const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const fetchApi = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const targetUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  const response = await fetch(targetUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = errorText;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) {
        errorMessage = errorJson.message;
      } else if (errorJson.error) {
        errorMessage = errorJson.error;
      }
    } catch (e) {
      // Ignore JSON parse error, use raw text
    }
    throw new Error(errorMessage || 'Something went wrong');
  }

  return response.json();
};
