import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-continous-swiper',
  standalone: true,
  imports: [],
  templateUrl: './continous-swiper.component.html',
  styleUrls: ['./continous-swiper.component.scss']
})
export class ContinousSwiperComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'ar';
  private languageSubscription!: Subscription;

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    // Subscribe to language changes
    this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.languageSubscription.unsubscribe();
  }

  // Method to get translations
  getTranslation(key: string): string {
    return this.translationService.getStringTranslation(key);
  }

  // Method to get direction (RTL or LTR)
  getDirection(): string {
    return this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }
}
