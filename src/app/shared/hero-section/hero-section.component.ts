import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { Subscription } from 'rxjs';
import { Carousel } from 'bootstrap';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'ar';
  private languageSubscription: Subscription | undefined;
  private observer: IntersectionObserver | undefined;
  private typingTimeout: any;
  private isTyping = false;
  private carousel: Carousel | undefined;
  private isSliding = false; // Prevent multiple slides at once

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize carousel with proper configuration
      setTimeout(() => {
        const carouselElement = document.getElementById('carouselExampleIndicators');
        if (carouselElement) {
          // Dispose any existing carousel instance
          const existingCarousel = Carousel.getInstance(carouselElement);
          if (existingCarousel) {
            existingCarousel.dispose();
          }

          // Create new carousel instance
          this.carousel = new Carousel(carouselElement, {
            interval: 5000,
            ride: 'carousel',
            pause: 'hover',
            wrap: true,
            touch: true,
            keyboard: true
          });

          // Prevent multiple simultaneous slides
          carouselElement.addEventListener('slide.bs.carousel', () => {
            this.isSliding = true;
          });

          carouselElement.addEventListener('slid.bs.carousel', () => {
            this.isSliding = false;
          });

          // Prevent clicks during transition
          const indicators = carouselElement.querySelectorAll('.carousel-indicators button');
          indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
              if (this.isSliding) {
                e.preventDefault();
                e.stopPropagation();
              }
            });
          });
        }
      }, 100);

      this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(lang => {
        this.currentLanguage = lang;
        this.restartTypingEffect();
      });

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              this.startTypingEffect();
              this.observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      const heroSection = document.querySelector('.hero-section') as HTMLElement;
      if (heroSection) {
        this.observer.observe(heroSection);
      }
    }
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
    this.observer?.disconnect();
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    if (this.carousel) {
      this.carousel.dispose();
    }
  }

  restartTypingEffect(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.isTyping = false;

    const titleElement = document.getElementById('typed-title');
    const subtitleElement = document.getElementById('typed-subtitle');
    const titleVisible = document.getElementById('typed-title-visible');
    const subtitleVisible = document.getElementById('typed-subtitle-visible');

    if (titleElement && subtitleElement && titleVisible && subtitleVisible) {
      titleVisible.textContent = '';
      subtitleVisible.textContent = '';
      titleElement.classList.remove('show-cursor');
      subtitleElement.classList.remove('show-cursor');

      setTimeout(() => this.startTypingEffect(), 100);
    }
  }

  startTypingEffect(): void {
    if (this.isTyping) return;
    this.isTyping = true;

    const titleElement = document.getElementById('typed-title');
    const subtitleElement = document.getElementById('typed-subtitle');
    const titleVisible = document.getElementById('typed-title-visible');
    const subtitleVisible = document.getElementById('typed-subtitle-visible');

    if (!titleElement || !subtitleElement || !titleVisible || !subtitleVisible) return;

    const titleText = this.getTranslation('hero_title');
    const subtitleText = this.getTranslation('hero_subtitle');

    titleElement.textContent = titleText;
    subtitleElement.textContent = subtitleText;

    let titleIndex = 0;
    let subtitleIndex = 0;

    const typeTitle = () => {
      if (titleIndex <= titleText.length) {
        titleVisible.textContent = titleText.substring(0, titleIndex);
        titleElement.classList.add('show-cursor');
        titleIndex++;
        this.typingTimeout = setTimeout(typeTitle, 80);
      } else {
        this.typingTimeout = setTimeout(typeSubtitle, 300);
      }
    };

    const typeSubtitle = () => {
      if (subtitleIndex <= subtitleText.length) {
        subtitleVisible.textContent = subtitleText.substring(0, subtitleIndex);
        subtitleElement.classList.add('show-cursor');
        subtitleIndex++;
        this.typingTimeout = setTimeout(typeSubtitle, 60);
      } else {
        this.typingTimeout = setTimeout(eraseSubtitle, 1500);
      }
    };

    const eraseSubtitle = () => {
      if (subtitleIndex >= 0) {
        subtitleVisible.textContent = subtitleText.substring(0, subtitleIndex);
        subtitleElement.classList.add('show-cursor');
        subtitleIndex--;
        this.typingTimeout = setTimeout(eraseSubtitle, 40);
      } else {
        subtitleElement.classList.remove('show-cursor');
        this.typingTimeout = setTimeout(eraseTitle, 100);
      }
    };

    const eraseTitle = () => {
      if (titleIndex >= 0) {
        titleVisible.textContent = titleText.substring(0, titleIndex);
        titleElement.classList.add('show-cursor');
        titleIndex--;
        this.typingTimeout = setTimeout(eraseTitle, 40);
      } else {
        titleElement.classList.remove('show-cursor');
        this.isTyping = false;
        this.typingTimeout = setTimeout(this.startTypingEffect.bind(this), 100);
      }
    };

    typeTitle();
  }

  navigateToAppointment(): void {
    this.router.navigate(['/appointment']);
  }

  navigateToExplore(): void {
    this.router.navigate(['/doctors']);
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }
}
