import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { API_ENDPOINTS } from '../constant/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // Register a new user with all required fields
  register(user: { name: string; email: string; password: string; phone: string; address: string; age: number; role?: string }): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.REGISTER, user);
  }

  // Login user
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  // Forget password
  forgetPassword(email: { email: string }): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.FORGET_PASSWORD, email);
  }

  // Reset password
  resetPassword(token: string, password: { password: string }): Observable<any> {
    return this.http.put(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, password);
  }

  // Create admin (if needed, assuming it requires admin auth)
  createAdmin(adminData: { name: string; email: string; password: string; phone: string; address: string; age: number }): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.CREATE_ADMIN, { ...adminData, role: 'admin' });
  }

  // Store token in localStorage (call this after successful login)
  storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
    }
  }

  // Get token from localStorage (for use in protected requests)
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Logout (remove token)
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
  }
}
