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
  ) {}

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

  resetPassword(token: string, password: { password: string }): Observable<any> {
    return this.http.put(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, password);
  }

  // Create admin
  createAdmin(adminData: { name: string; email: string; password: string; phone: string; address: string; age: number }): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.CREATE_ADMIN, { ...adminData, role: 'admin' });
  }

  storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // Returns true if token exists
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      // Decode JWT (assuming standard JWT format)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin';
    } catch (e) {
      console.error('Error decoding token:', e);
      return false;
    }
  }

  // Logout (remove token)
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
  }
}
