/**
 * Timeline Service
 *
 * Handles timeline query API calls with filtering support
 */

import { apiClient } from '../client';
import { TimelineEventResponse, TimelineQueryParams } from '../types';

export const timelineService = {
  /**
   * Get timeline events with optional filtering
   *
   * @param params - Query parameters for filtering
   *   - carId: Filter by specific car (or "all")
   *   - fromDate: Start date (ISO string)
   *   - toDate: End date (ISO string)
   *   - category: Filter by category
   *   - type: Filter by event type (receipt/issue/maintenance)
   * @returns Array of timeline events sorted chronologically
   */
  async getTimeline(params: TimelineQueryParams = {}): Promise<TimelineEventResponse[]> {
    // Build query string from params, filtering out null/undefined values
    const queryParams: Record<string, string> = {};

    if (params.carId && params.carId !== 'all') {
      queryParams.carId = params.carId;
    }
    if (params.fromDate) {
      queryParams.fromDate = params.fromDate;
    }
    if (params.toDate) {
      queryParams.toDate = params.toDate;
    }
    if (params.category && params.category !== 'all') {
      queryParams.category = params.category;
    }
    if (params.type && params.type !== 'all') {
      queryParams.type = params.type;
    }

    // Convert params object to query string
    const queryString = new URLSearchParams(queryParams).toString();

    // Make API call with query string
    const endpoint = queryString ? `/timeline?${queryString}` : '/timeline';
    return apiClient.get<TimelineEventResponse[]>(endpoint);
  },
};