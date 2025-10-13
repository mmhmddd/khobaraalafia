import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { CursorImagesService, CursorImage } from '../../core/services/cursor-images.service';
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
  images: CursorImage[] = [];
  currentLanguage: string = 'ar';
  private languageSubscription: Subscription | undefined;
  private observer: IntersectionObserver | undefined;
  private typingTimeout: any;
  private isTyping = false;
  private carousel: Carousel | undefined;
  private isSliding = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService,
    private cursorImagesService: CursorImagesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadImages();
    if (isPlatformBrowser(this.platformId)) {
      this.initializeLanguageSubscription();
      this.initializeIntersectionObserver();
    }
  }

  private initializeLanguageSubscription(): void {
    this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(lang => {
      this.currentLanguage = lang;
      this.restartTypingEffect();
    });
  }

  private initializeIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            setTimeout(() => this.startTypingEffect(), 300);
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const heroSection = document.querySelector('.hero-section') as HTMLElement;
    if (heroSection) {
      this.observer.observe(heroSection);
    }
  }

  loadImages(): void {
    this.cursorImagesService.getAllCursorImages().subscribe({
      next: (images) => {
        this.images = images
          .filter(image => image.isActive)
          .sort((a, b) => a.order - b.order);
        if (isPlatformBrowser(this.platformId) && this.images.length > 0) {
          setTimeout(() => this.initializeCarousel(), 100);
        }
      },
      error: (error) => {
        console.error('Failed to load cursor images:', error);
        this.images = [];
      }
    });
  }

  initializeCarousel(): void {
    const carouselElement = document.getElementById('carouselExampleIndicators');
    if (carouselElement) {
      const existingCarousel = Carousel.getInstance(carouselElement);
      if (existingCarousel) {
        existingCarousel.dispose();
      }

      this.carousel = new Carousel(carouselElement, {
        interval: 5000,
        ride: 'carousel',
        pause: 'hover',
        wrap: true,
        touch: true,
        keyboard: true
      });

      carouselElement.addEventListener('slide.bs.carousel', () => {
        this.isSliding = true;
        console.log('Carousel slide event triggered');
      });

      carouselElement.addEventListener('slid.bs.carousel', () => {
        this.isSliding = false;
        console.log('Carousel slid event completed');
      });

      const indicators = carouselElement.querySelectorAll('.carousel-indicators button');
      indicators.forEach(indicator => {
        indicator.addEventListener('click', (e) => {
          if (this.isSliding) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      });

      console.log('Carousel initialized successfully');
    } else {
      console.error('Carousel element not found');
    }
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/fallback-image.jpg';
    console.warn('Image failed to load, using fallback:', img.src);
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
    this.clearTypedText();
    setTimeout(() => this.startTypingEffect(), 100);
  }

  private clearTypedText(): void {
    const elements = {
      titleVisible: document.getElementById('typed-title-visible'),
      subtitleVisible: document.getElementById('typed-subtitle-visible'),
      title: document.getElementById('typed-title'),
      subtitle: document.getElementById('typed-subtitle')
    };

    if (elements.titleVisible) elements.titleVisible.textContent = '';
    if (elements.subtitleVisible) elements.subtitleVisible.textContent = '';
    if (elements.title) elements.title.classList.remove('show-cursor');
    if (elements.subtitle) elements.subtitle.classList.remove('show-cursor');
  }

  startTypingEffect(): void {
    if (this.isTyping) return;
    this.isTyping = true;

    const elements = {
      title: document.getElementById('typed-title'),
      subtitle: document.getElementById('typed-subtitle'),
      titleVisible: document.getElementById('typed-title-visible'),
      subtitleVisible: document.getElementById('typed-subtitle-visible')
    };

    if (!elements.title || !elements.subtitle || !elements.titleVisible || !elements.subtitleVisible) {
      this.isTyping = false;
      return;
    }

    const titleText = this.getTranslation('hero_title');
    const subtitleText = this.getTranslation('hero_subtitle');

    elements.title.textContent = titleText;
    elements.subtitle.textContent = subtitleText;

    elements.title.style.width = `${elements.title.offsetWidth}px`;
    elements.subtitle.style.width = `${elements.subtitle.offsetWidth}px`;

    elements.titleVisible.textContent = '';
    elements.subtitleVisible.textContent = '';

    this.typeSequence(elements, titleText, subtitleText);
  }

  private typeSequence(elements: any, titleText: string, subtitleText: string): void {
    let titleIndex = 0;
    let subtitleIndex = 0;

    const typeTitle = (): void => {
      if (titleIndex <= titleText.length) {
        elements.titleVisible.textContent = titleText.substring(0, titleIndex);
        elements.titleVisible.classList.add('show-cursor');
        titleIndex++;
        this.typingTimeout = setTimeout(typeTitle, 80);
      } else {
        elements.titleVisible.classList.remove('show-cursor');
        this.typingTimeout = setTimeout(typeSubtitle, 300);
      }
    };

    const typeSubtitle = (): void => {
      if (subtitleIndex <= subtitleText.length) {
        elements.subtitleVisible.textContent = subtitleText.substring(0, subtitleIndex);
        elements.subtitleVisible.classList.add('show-cursor');
        subtitleIndex++;
        this.typingTimeout = setTimeout(typeSubtitle, 60);
      } else {
        elements.subtitleVisible.classList.remove('show-cursor');
        this.typingTimeout = setTimeout(eraseSubtitle, 1500);
      }
    };

    const eraseSubtitle = (): void => {
      if (subtitleIndex >= 0) {
        elements.subtitleVisible.textContent = subtitleText.substring(0, subtitleIndex);
        elements.subtitleVisible.classList.add('show-cursor');
        subtitleIndex--;
        this.typingTimeout = setTimeout(eraseSubtitle, 40);
      } else {
        elements.subtitleVisible.classList.remove('show-cursor');
        this.typingTimeout = setTimeout(eraseTitle, 100);
      }
    };

    const eraseTitle = (): void => {
      if (titleIndex >= 0) {
        elements.titleVisible.textContent = titleText.substring(0, titleIndex);
        elements.titleVisible.classList.add('show-cursor');
        titleIndex--;
        this.typingTimeout = setTimeout(eraseTitle, 40);
      } else {
        elements.titleVisible.classList.remove('show-cursor');
        this.isTyping = false;
        this.typingTimeout = setTimeout(() => this.startTypingEffect(), 100);
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
