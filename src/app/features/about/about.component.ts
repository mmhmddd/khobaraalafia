import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HomeTranslationService } from '../../core/services/home-translation.service';
import { Subscription } from 'rxjs';
import { StatsSectionComponent } from "../../shared/stats-section/stats-section.component";
import { TestimonialsComponent } from "../../shared/testimonials/testimonials.component";
import { ContinousSwiperComponent } from "../../shared/continous-swiper/continous-swiper.component";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, StatsSectionComponent, TestimonialsComponent, ContinousSwiperComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'ar';
  private languageSubscription: Subscription | undefined;
  private observer: IntersectionObserver | undefined;

  values = [
    { label: 'التميز', description: 'نسعى للريادة في كل ما نقدمه، من الخدمات الطبية إلى تجربة المريض.' },
    { label: 'الجودة', description: 'نلتزم بتقديم خدمات طبية عالية الجودة واتباع معايير سباهي لضمان سلامة المرضى.' },
    { label: 'الاحترام', description: 'نؤمن بتقديم رعاية تشعر المرضى بالتقدير والاحترام في كل خطوة.' },
    { label: 'الشفافية', description: 'نحرص على توضيح وتقديم معلومات دقيقة حول كل علاج وإجراء.' },
    { label: 'الابتكار', description: 'نواكب أحدث التقنيات الطبية لضمان تقديم خدمات فعالة وسريعة.' }
  ];

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

  navigateToContact() {
    console.log('Navigating to contact page');
    // Add navigation logic here, e.g., this.router.navigate(['/contact']);
  }

  navigateToServices() {
    console.log('Navigating to services page');
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
