import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constant/api-endpoints';
import { Clinic } from './clinic.service';
import { AuthService } from './auth.service';

export interface Booking {
  _id?: string;
  user?: { _id: string; name: string; email: string };
  clinic: Clinic;
  date: string | Date;
  time: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  clientEmail: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingNumber: number;
  confirmationCode: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  createBooking(booking: {
    clientName: string;
    clientPhone: string;
    clientAddress: string;
    clientEmail: string;
    clinicId: string;
    date: string;
    time: string;
  }): Observable<Booking> {
    return this.http.post<Booking>(
      API_ENDPOINTS.BOOKINGS.CREATE,
      booking,
      { headers: this.getAuthHeaders() }
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

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      API_ENDPOINTS.BOOKINGS.GET_ALL,
      { headers: this.getAuthHeaders() }
    );
  }

  // New method to fetch clinics
  getClinics(): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(
      API_ENDPOINTS.CLINICS.GET_ALL,
      { headers: this.getAuthHeaders() }
    );
  }
}
