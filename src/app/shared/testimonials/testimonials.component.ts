import { Component, AfterViewInit, OnInit, OnDestroy, ChangeDetectorRef, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { TestimonialService } from '../../core/services/testimonial.service';
import { TranslationService } from '../../core/services/translation.service';
import { Observable, map } from 'rxjs';
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
  template: `
    <section class="testimonials-section" role="region" [attr.aria-label]="(translations$ | async)?.aria_label">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">{{ (translations$ | async)?.badge }}</span>
          <h2 class="section-title">{{ (translations$ | async)?.title }}</h2>
          <div class="section-borders">
            <span></span>
            <span class="black-border"></span>
            <span></span>
          </div>
        </div>

        <div *ngIf="error" class="alert alert-danger text-center" role="alert">{{ error }}</div>

        <div *ngIf="testimonialChunks.length; else noTestimonials" id="testimonialsCarousel" class="carousel slide testimonials-carousel" data-bs-ride="carousel" data-bs-interval="5000">
          <!-- Carousel Indicators -->
          <div class="carousel-indicators">
            <button
              type="button"
              *ngFor="let chunk of testimonialChunks; let i = index"
              [attr.data-bs-target]="'#testimonialsCarousel'"
              [attr.data-bs-slide-to]="i"
              [class.active]="i === 0"
              [attr.aria-label]="(translations$ | async)?.carousel.slide_label.replace('{number}', (i + 1).toString())"
              [attr.aria-current]="i === 0 ? 'true' : 'false'">
            </button>
          </div>

          <!-- Carousel Inner -->
          <div class="carousel-inner">
            <div
              class="carousel-item"
              *ngFor="let slideTestimonials of testimonialChunks; let i = index"
              [class.active]="i === 0">
              <div class="cards-wrapper">
                <!-- Testimonial Card -->
                <div class="single-testimonial-item card" *ngFor="let testimonial of slideTestimonials">
                  <div class="card-body">
                    <p class="comment" [dir]="(translations$ | async)?.aria_label === 'Customer Testimonials' ? 'ltr' : 'rtl'" [lang]="(translations$ | async)?.aria_label === 'Customer Testimonials' ? 'en' : 'ar'">{{ testimonial.text }}</p>
                    <div class="profile-container">
                      <h3 class="name">{{ testimonial.name }} <span class="role" *ngIf="testimonial.jobTitle">{{ testimonial.jobTitle }}</span></h3>
                    </div>
                    <div class="rating">
                      <span *ngFor="let star of [1,2,3,4,5]"
                            [ngClass]="getStarClass(testimonial.rating, star)">★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Carousel Controls -->
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#testimonialsCarousel"
            data-bs-slide="prev"
            *ngIf="testimonialChunks.length > 1"
            [attr.aria-label]="(translations$ | async)?.carousel.previous_slide">
            <span class="carousel-control-prev-icon" aria-hidden="true"><i class="fas fa-long-arrow-alt-right"></i></span>
            <span class="visually-hidden">{{ (translations$ | async)?.carousel.previous_slide }}</span>
          </button>

          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#testimonialsCarousel"
            data-bs-slide="next"
            *ngIf="testimonialChunks.length > 1"
            [attr.aria-label]="(translations$ | async)?.carousel.next_slide">
            <span class="carousel-control-next-icon" aria-hidden="true"><i class="fas fa-long-arrow-alt-left"></i></span>
            <span class="visually-hidden">{{ (translations$ | async)?.carousel.next_slide }}</span>
          </button>
        </div>

        <ng-template #noTestimonials>
          <div class="alert alert-info text-center" role="alert">
            {{ (translations$ | async)?.no_testimonials }}
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit, AfterViewInit, OnDestroy {
  testimonials: Testimonial[] = [];
  testimonialChunks: Testimonial[][] = [];
  error: string = '';
  translations$: Observable<any>;
  private carouselInstance: Carousel | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private testimonialService: TestimonialService,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.translations$ = this.translationService.getCurrentLanguage().pipe(
      map(() => ({
        aria_label: this.translationService.getStringTranslation('testimonials_section.aria_label'),
        badge: this.translationService.getStringTranslation('testimonials_section.badge'),
        title: this.translationService.getStringTranslation('testimonials_section.title'),
        error: this.translationService.getStringTranslation('testimonials_section.error'),
        no_testimonials: this.translationService.getStringTranslation('testimonials_section.no_testimonials'),
        carousel: {
          previous_slide: this.translationService.getStringTranslation('testimonials_section.carousel.previous_slide'),
          next_slide: this.translationService.getStringTranslation('testimonials_section.carousel.next_slide'),
          slide_label: this.translationService.getStringTranslation('testimonials_section.carousel.slide_label')
        }
      }))
    );
  }

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
      error: () => {
        this.error = this.translationService.getStringTranslation('testimonials_section.error');
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
      if (this.carouselInstance) {
        this.carouselInstance.dispose();
      }

      this.carouselInstance = new Carousel(carouselElement, {
        interval: 5000,
        ride: 'carousel',
        touch: true,
        pause: 'hover'
      });

      carouselElement.addEventListener('slide.bs.carousel', () => {
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      });

      carouselElement.addEventListener('slid.bs.carousel', (event: any) => {
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
