import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StatsSectionComponent } from '../../shared/stats-section/stats-section.component';
import { TestimonialsComponent } from '../../shared/testimonials/testimonials.component';
import { ContinousSwiperComponent } from '../../shared/continous-swiper/continous-swiper.component';
import { TranslationService } from '../../core/services/translation.service';

interface Value {
  label: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, StatsSectionComponent, TestimonialsComponent, ContinousSwiperComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  currentLanguage$: Observable<string>;
  values$: Observable<Value[]>;
  private languageSubscription: Subscription | undefined;
  private observer: IntersectionObserver | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService,
    private router: Router
  ) {
    this.currentLanguage$ = this.translationService.getCurrentLanguage();

    // Fixed: Properly get values array from translation service
    this.values$ = this.currentLanguage$.pipe(
      map(() => {
        const values = this.translationService.getTranslation<Value[]>('vision_mission.values');
        console.log('Values loaded:', values); // Debug log
        return Array.isArray(values) ? values : [];
      })
    );
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.languageSubscription = this.currentLanguage$.subscribe(lang => {
        console.log(`Language changed to: ${lang}`);
        this.updateDocumentDirection(lang);
      });

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

  navigateToContact() {
    this.router.navigate(['/appointment']);
  }

  navigateToServices() {
    this.router.navigate(['/clinics']);
  }

  // Fixed: This method now properly handles string translations
  getStringTranslation(key: string): Observable<string> {
    return this.currentLanguage$.pipe(
      map(() => {
        const translation = this.translationService.getStringTranslation(key);
        console.log(`Translation for "${key}":`, translation); // Debug log
        return translation || key;
      })
    );
  }

  private updateDocumentDirection(lang: string): void {
    const sections = [
      document.querySelector('.hero-section'),
      document.querySelector('.about-intro-section'),
      document.querySelector('.vision-mission-section'),
      document.querySelector('.cta-section')
    ] as HTMLElement[];

    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    sections.forEach(section => {
      if (section) {
        section.setAttribute('dir', direction);
      }
    });
    document.documentElement.setAttribute('lang', lang);
  }
}
