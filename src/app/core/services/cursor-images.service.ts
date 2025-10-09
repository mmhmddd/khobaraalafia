import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constant/api-endpoints';

export interface CursorImage {
  _id: string;
  title?: string; // Optional
  description?: string; // Optional
  imageUrl: string;
  order: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CursorImagesService {
  constructor(private http: HttpClient) {}

  // Get all active cursor images
  getAllCursorImages(): Observable<CursorImage[]> {
    return this.http.get<CursorImage[]>(API_ENDPOINTS.CURSOR_IMAGES.GET_ALL);
  }

  // Get single cursor image by ID
  getCursorImageById(id: string): Observable<CursorImage> {
    return this.http.get<CursorImage>(API_ENDPOINTS.CURSOR_IMAGES.GET_BY_ID(id));
  }

  // Create new cursor image (requires auth)
  createCursorImage(formData: FormData, token: string): Observable<CursorImage> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<CursorImage>(API_ENDPOINTS.CURSOR_IMAGES.CREATE, formData, { headers });
  }

  // Update cursor image (requires auth)
  updateCursorImage(id: string, formData: FormData, token: string): Observable<CursorImage> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<CursorImage>(API_ENDPOINTS.CURSOR_IMAGES.UPDATE(id), formData, { headers });
  }

  // Delete cursor image (requires auth)
  deleteCursorImage(id: string, token: string): Observable<{ message: string }> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<{ message: string }>(API_ENDPOINTS.CURSOR_IMAGES.DELETE(id), { headers });
  }
}
