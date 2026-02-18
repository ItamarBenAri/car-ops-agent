/**
 * API Type Definitions
 *
 * All API request/response types matching backend DTOs
 * Includes transformer functions to handle type mismatches between backend and frontend
 */

// ==================== CAR TYPES ====================

/**
 * Car API Response (matches backend Car entity)
 * Backend returns year as number
 */
export interface CarApiResponse {
  id: string;
  manufacturer: string;
  model: string;
  year: number; // Backend returns number
  engine: string;
  transmission: string;
  nickname: string;
  driveStatus: 'connected' | 'disconnected' | 'syncing';
  km: string; // Already formatted: "85,000 ק״מ"
  stats: {
    totalExpenses: number;
    openIssues: number;
    lastMaintenance: string | null;
  };
}

/**
 * Car Data (frontend display type)
 * Frontend expects year as string
 */
export interface CarData {
  id: string;
  manufacturer: string;
  model: string;
  year: string; // Frontend expects string for display
  engine: string;
  transmission: string;
  nickname: string;
  driveStatus: 'connected' | 'disconnected' | 'syncing';
  km: string;
}

/**
 * Transformer to convert Car API response to frontend Car Data
 * Handles year: number → string conversion
 */
export function transformCarResponse(apiResponse: CarApiResponse): CarData {
  return {
    id: apiResponse.id,
    manufacturer: apiResponse.manufacturer,
    model: apiResponse.model,
    year: String(apiResponse.year), // Convert number to string
    engine: apiResponse.engine,
    transmission: apiResponse.transmission,
    nickname: apiResponse.nickname,
    driveStatus: apiResponse.driveStatus,
    km: apiResponse.km,
  };
}

/**
 * Create Car DTO (matches backend CreateCarDto)
 * Send year as number to backend
 */
export interface CreateCarDto {
  manufacturer: string;
  model: string;
  year: number; // Send as number to backend
  engine?: string;
  transmission?: string;
  nickname?: string;
  currentOdometerKm?: number;
}

/**
 * Update Car DTO (partial)
 */
export interface UpdateCarDto {
  manufacturer?: string;
  model?: string;
  year?: number;
  engine?: string;
  transmission?: string;
  nickname?: string;
}

/**
 * Update Odometer DTO
 */
export interface UpdateOdometerDto {
  odometerKm: number;
}

// ==================== TIMELINE TYPES ====================

/**
 * Timeline Event Response (matches backend TimelineEvent interface)
 * Perfect alignment - no transformation needed
 */
export interface TimelineEventResponse {
  id: string;
  title: string;
  date: string; // ISO string
  km: string; // Formatted: "85,240 ק״מ"
  vendor: string;
  amount: string; // Formatted: "₪450"
  category: string;
  type: 'receipt' | 'issue' | 'maintenance';
  documentLink?: string;
}

/**
 * Timeline Query Parameters
 */
export interface TimelineQueryParams {
  carId?: string;
  fromDate?: string; // ISO date
  toDate?: string; // ISO date
  category?: string;
  type?: 'receipt' | 'issue' | 'maintenance';
}

// ==================== AUTHENTICATION TYPES ====================

/**
 * Login DTO
 */
export interface LoginDto {
  email: string;
  name?: string;
}

/**
 * Auth Response
 */
export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

/**
 * User type
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'partner';
}

// ==================== DOCUMENT TYPES ====================

/**
 * Document Response
 */
export interface DocumentResponse {
  id: string;
  carId: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  driveFileId?: string;
  type: 'receipt' | 'issue_photo' | 'manual' | 'other';
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  createdAt: string;
}

/**
 * Create Document DTO
 */
export interface CreateDocumentDto {
  carId: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  type: 'receipt' | 'issue_photo' | 'manual' | 'other';
}

// ==================== JOB TYPES ====================

export interface JobResponse {
  id: string;
  documentId: string;
  type: 'parse_receipt' | 'analyze_issue' | 'calculate_reminders' | 'scan_drive';
  status: 'pending' | 'running' | 'done' | 'failed';
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  error: string | null;
  attempts: number;
  createdAt: string;
  completedAt: string | null;
}

export interface UploadResponse {
  document: DocumentResponse;
  jobId: string;
}

// ==================== COMMON TYPES ====================

/**
 * API Error Response
 */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}