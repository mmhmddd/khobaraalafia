import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HomeTranslationService } from '../../core/services/home-translation.service';
import { Subscription } from 'rxjs';

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: HomeTranslationService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(lang => {
        this.currentLanguage = lang;
        this.updateDocumentDirection();
      });

      // Initialize IntersectionObserver for animations
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
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
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  navigateToAppointment() {
    console.log('Navigating to appointment booking');
    // Add navigation logic here, e.g., this.router.navigate(['/booking']);
  }

  navigateToExplore() {
    console.log('Navigating to explore services');
    // Add navigation logic here, e.g., this.router.navigate(['/services']);
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }

  private updateDocumentDirection(): void {
    const heroSection = document.querySelector('.hero-section') as HTMLElement;
    const direction = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    if (heroSection) {
      heroSection.setAttribute('dir', direction);
    }
    document.documentElement.setAttribute('lang', this.currentLanguage);
  }
}
