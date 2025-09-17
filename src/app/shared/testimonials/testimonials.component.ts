import { Component, AfterViewInit, OnInit, OnDestroy, ChangeDetectorRef, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { TestimonialService } from '../../core/services/testimonial.service';
import { Carousel } from 'bootstrap';

interface Testimonial {
  _id: string;
  name: string;
  jobTitle: string;
  text: string;
  rating: number;
  createdAt?: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit, AfterViewInit, OnDestroy {
  testimonials: Testimonial[] = [];
  testimonialChunks: Testimonial[][] = [];
  error: string = '';
  private carouselInstance: Carousel | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private testimonialService: TestimonialService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadTestimonials();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.initializeBootstrapCarousel();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.carouselInstance) {
      this.carouselInstance.dispose();
      this.carouselInstance = null;
    }
  }

  loadTestimonials(): void {
    this.testimonialService.getAllTestimonials().subscribe({
      next: (response: any) => {
        this.testimonials = response.data || [];
        this.error = '';
        this.createTestimonialChunks();
        this.cdr.detectChanges();
        if (isPlatformBrowser(this.platformId)) {
          this.ngZone.runOutsideAngular(() => {
            this.initializeBootstrapCarousel();
          });
        }
      },
      error: (error) => {
        this.error = 'خطأ في تحميل الآراء';
        console.error('Error loading testimonials:', error);
        this.testimonials = [];
        this.testimonialChunks = [];
        this.cdr.detectChanges();
      }
    });
  }

  createTestimonialChunks(): void {
    this.testimonialChunks = [];
    for (let i = 0; i < this.testimonials.length; i += 2) {
      this.testimonialChunks.push(this.testimonials.slice(i, i + 2));
    }
  }

  initializeBootstrapCarousel(): void {
    const carouselElement = document.getElementById('testimonialsCarousel');
    if (carouselElement && this.testimonialChunks.length > 0) {
      // Dispose of existing carousel instance to prevent duplicates
      if (this.carouselInstance) {
        this.carouselInstance.dispose();
      }

      // Initialize new carousel instance
      this.carouselInstance = new Carousel(carouselElement, {
        interval: 5000,
        ride: 'carousel',
        touch: true,
        pause: 'hover'
      });

      // Handle slide events to ensure smooth transitions
      carouselElement.addEventListener('slide.bs.carousel', () => {
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      });

      carouselElement.addEventListener('slid.bs.carousel', (event: any) => {
        console.log('Carousel slid to:', event.to);
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      });
    }
  }

  getStarClass(rating: number, star: number): string {
    return rating >= star ? 'star filled' : 'star';
  }
}
