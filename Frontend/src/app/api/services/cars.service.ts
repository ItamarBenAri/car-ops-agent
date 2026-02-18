/**
 * Cars Service
 *
 * Handles all cars-related API calls (CRUD operations)
 */

import { apiClient } from '../client';
import {
  CarApiResponse,
  CarData,
  CreateCarDto,
  UpdateCarDto,
  UpdateOdometerDto,
  transformCarResponse,
} from '../types';

export const carsService = {
  /**
   * Get all cars for the authenticated user
   * Transforms year: number → string for frontend display
   *
   * @returns Array of car data
   */
  async getAllCars(): Promise<CarData[]> {
    const cars = await apiClient.get<CarApiResponse[]>('/cars');
    return cars.map(transformCarResponse);
  },

  /**
   * Get a specific car by ID
   *
   * @param id - Car ID
   * @returns Car data
   */
  async getCarById(id: string): Promise<CarData> {
    const car = await apiClient.get<CarApiResponse>(`/cars/${id}`);
    return transformCarResponse(car);
  },

  /**
   * Create a new car
   *
   * @param dto - Car creation data
   * @returns Created car data
   */
  async createCar(dto: CreateCarDto): Promise<CarData> {
    const car = await apiClient.post<CarApiResponse>('/cars', dto);
    return transformCarResponse(car);
  },

  /**
   * Update an existing car
   *
   * @param id - Car ID
   * @param dto - Updated car data (partial)
   * @returns Updated car data
   */
  async updateCar(id: string, dto: UpdateCarDto): Promise<CarData> {
    const car = await apiClient.patch<CarApiResponse>(`/cars/${id}`, dto);
    return transformCarResponse(car);
  },

  /**
   * Update car odometer reading
   *
   * @param id - Car ID
   * @param odometerKm - New odometer reading in km
   * @returns Updated car data
   */
  async updateOdometer(
    id: string,
    odometerKm: number
  ): Promise<CarData> {
    const dto: UpdateOdometerDto = { odometerKm };
    const car = await apiClient.patch<CarApiResponse>(
      `/cars/${id}/odometer`,
      dto
    );
    return transformCarResponse(car);
  },

  /**
   * Delete a car
   *
   * @param id - Car ID
   */
  async deleteCar(id: string): Promise<void> {
    await apiClient.delete(`/cars/${id}`);
  },
};