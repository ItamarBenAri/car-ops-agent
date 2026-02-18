/**
 * API Client - Centralized fetch wrapper with authentication and error handling
 *
 * Features:
 * - Automatic base URL from environment variables
 * - Auto-inject x-user-id header from localStorage
 * - Global error handling with Hebrew messages
 * - Type-safe wrapper functions for HTTP methods
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = (import.meta as any).env.VITE_API_TIMEOUT || 10000;

class ApiClient {
  /**
   * Generic request method with authentication and error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(userId && { 'x-user-id': userId }),
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        let errorMessage = 'שגיאה בשרת';

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If parsing error response fails, use status text
          errorMessage = response.statusText || errorMessage;
        }

        // Handle specific HTTP status codes
        if (response.status === 401) {
          errorMessage = 'נדרשת הזדהות מחדש';
          // Clear auth data on 401
          localStorage.removeItem('userId');
          localStorage.removeItem('authToken');
        } else if (response.status === 403) {
          errorMessage = 'אין הרשאה לבצע פעולה זו';
        } else if (response.status === 404) {
          errorMessage = 'המשאב המבוקש לא נמצא';
        } else if (response.status >= 500) {
          errorMessage = 'שגיאה בשרת - נסה שוב מאוחר יותר';
        }

        throw new Error(errorMessage);
      }

      // Parse and return response
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle network errors
      if (error instanceof TypeError) {
        throw new Error('בעיית תקשורת - בדוק את החיבור לשרת');
      }

      // Handle timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('הבקשה נכשלה - פג תוקף הזמן');
      }

      // Re-throw other errors
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * POST multipart/form-data (for file uploads).
   * Does NOT set Content-Type — browser sets it with boundary automatically.
   */
  async postForm<T>(endpoint: string, formData: FormData): Promise<T> {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          ...(userId && { 'x-user-id': userId }),
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: formData,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'שגיאה בהעלאת הקובץ';
        try {
          const err = await response.json();
          errorMessage = err.message || errorMessage;
        } catch { /* ignore */ }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof TypeError) throw new Error('בעיית תקשורת - בדוק את החיבור לשרת');
      if (error instanceof Error && error.name === 'AbortError') throw new Error('הבקשה נכשלה - פג תוקף הזמן');
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();