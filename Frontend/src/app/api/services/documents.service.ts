import { apiClient } from '../client';
import { UploadResponse, JobResponse } from '../types';

export const documentsService = {
  /**
   * Upload a file and trigger background AI processing.
   * Returns the created document and job ID for polling.
   */
  async upload(file: File, carId: string, type: 'receipt' | 'issue_photo'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('carId', carId);
    formData.append('type', type);
    return apiClient.postForm<UploadResponse>('/documents/upload', formData);
  },

  /**
   * Poll a job by ID to check processing status.
   */
  async getJob(jobId: string): Promise<JobResponse> {
    return apiClient.get<JobResponse>(`/jobs/${jobId}`);
  },
};
