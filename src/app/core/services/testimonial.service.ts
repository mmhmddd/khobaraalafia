import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constant/api-endpoints';

interface Testimonial {
  _id?: string;
  name: string;
  jobTitle: string;
  text: string;
  rating: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  constructor(private http: HttpClient) {}

  // Get authorization headers with JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  // Get all testimonials (public)
  getAllTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(API_ENDPOINTS.TESTIMONIALS.GET_ALL);
  }

  // Get a single testimonial by ID (public)
  getTestimonialById(id: string): Observable<Testimonial> {
    return this.http.get<Testimonial>(API_ENDPOINTS.TESTIMONIALS.GET_BY_ID(id));
  }

  // Create a new testimonial (admin only)
  createTestimonial(testimonial: Testimonial): Observable<Testimonial> {
    return this.http.post<Testimonial>(
      API_ENDPOINTS.TESTIMONIALS.CREATE,
      testimonial,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update a testimonial (admin only)
  updateTestimonial(id: string, testimonial: Testimonial): Observable<Testimonial> {
    return this.http.put<Testimonial>(
      API_ENDPOINTS.TESTIMONIALS.UPDATE(id),
      testimonial,
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete a testimonial (admin only)
  deleteTestimonial(id: string): Observable<void> {
    return this.http.delete<void>(
      API_ENDPOINTS.TESTIMONIALS.DELETE(id),
      { headers: this.getAuthHeaders() }
    );
  }
}
