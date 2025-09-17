// src/app/services/users.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constant/api-endpoints';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper method to add Authorization header
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Get all users
  getAllUsers(): Observable<any> {
    return this.http.get(API_ENDPOINTS.USERS.GET_ALL, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user by ID
  getUserById(id: string): Observable<any> {
    return this.http.get(API_ENDPOINTS.USERS.GET_BY_ID(id), {
      headers: this.getAuthHeaders()
    });
  }

  // Update user
  updateUser(id: string, userData: { name?: string; email?: string; phone?: string; address?: string; age?: number; role?: string }): Observable<any> {
    return this.http.put(API_ENDPOINTS.USERS.UPDATE(id), userData, {
      headers: this.getAuthHeaders()
    });
  }

  // Delete user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(API_ENDPOINTS.USERS.DELETE(id), {
      headers: this.getAuthHeaders()
    });
  }
}
