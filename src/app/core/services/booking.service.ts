import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constant/api-endpoints';
import { Clinic } from './clinic.service';
import { AuthService } from './auth.service';

export interface Booking {
  clinic: any;
  _id: string;
  user?: { _id: string; name: string; email: string } | null; // Allow null for guest bookings
  clinicName: string; // Changed from clinic object to string to match backend response
  date: string | Date;
  time: string;
  clientName: string;
  clientPhone: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingNumber: number;
  confirmationCode: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(requireAuth: boolean = true): HttpHeaders {
    const token = this.authService.getToken();
    if (requireAuth && !token) {
      throw new Error('Authentication token is required');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  createBooking(booking: {
    clientName: string;
    clientPhone: string;
    clinicId: string;
    date: string;
    time: string;
  }): Observable<{ message: string; booking: Booking }> {
    // Allow createBooking without authentication
    return this.http.post<{ message: string; booking: Booking }>(
      API_ENDPOINTS.BOOKINGS.CREATE,
      booking,
      { headers: this.getAuthHeaders(false) } // Pass false to skip auth requirement
    );
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      API_ENDPOINTS.BOOKINGS.GET_MY_BOOKINGS,
      { headers: this.getAuthHeaders() }
    );
  }

  cancelBooking(id: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      API_ENDPOINTS.BOOKINGS.CANCEL(id),
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  deleteBooking(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      API_ENDPOINTS.BOOKINGS.DELETE(id),
      { headers: this.getAuthHeaders() }
    );
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      API_ENDPOINTS.BOOKINGS.GET_ALL,
      { headers: this.getAuthHeaders() }
    );
  }

  getClinics(): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(
      API_ENDPOINTS.CLINICS.GET_ALL,
      { headers: this.getAuthHeaders(false) } // Allow fetching clinics without auth
    );
  }
}
