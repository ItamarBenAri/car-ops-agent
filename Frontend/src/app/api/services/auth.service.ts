/**
 * Authentication Service
 *
 * Handles all authentication-related API calls
 */

import { apiClient } from '../client';
import { LoginDto, AuthResponse, User } from '../types';

export const authService = {
  /**
   * Login with email (no password for MVP)
   * Backend will create user if doesn't exist
   *
   * @param dto - Login credentials (email + optional name)
   * @returns Auth response with token and user data
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', dto);
  },

  /**
   * Get current authenticated user
   *
   * @returns Current user data
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },
};