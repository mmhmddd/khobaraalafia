import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DoctorsService, Doctor } from '../../core/services/doctors.service';
import { TranslationService } from '../../core/services/translation.service';

interface DisplayDoctor extends Doctor {
  rating: number;
}

// Define an interface for the translations object
interface DoctorTranslations {
  section_title: string;
  section_subtitle: string;
  search_placeholder: string;
  book_consultation: string;
  book_now: string;
  book_appointment: string;
}

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('doctorsSection') doctorsSection!: ElementRef;
  @ViewChild('heroSection') heroSection!: ElementRef;

  heroData = {
    subtitle: '',
    title: '',
    description: '',
    buttonText: ''
  };
  translations: DoctorTranslations = {
    section_title: '',
    section_subtitle: '',
    search_placeholder: '',
    book_consultation: '',
    book_now: '',
    book_appointment: ''
  };

  doctors: DisplayDoctor[] = [];
  filteredDoctors: DisplayDoctor[] = [];
  searchQuery: string = '';
  isHeroVisible: boolean = false;

  private languageSubscription?: Subscription;

  constructor(
    private doctorsService: DoctorsService,
    private translationService: TranslationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAllDoctors();
    this.loadTranslations();
    this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(() => {
      this.loadTranslations();
    });
  }

  ngAfterViewInit() {
    this.observeDoctorCards();
    this.observeHeroSection();
  }

  ngOnDestroy() {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  private loadTranslations() {
    this.heroData = {
      subtitle: this.translationService.getStringTranslation('doctors_section.hero_subtitle'),
      title: this.translationService.getStringTranslation('doctors_section.hero_title'),
      description: this.translationService.getStringTranslation('doctors_section.hero_description'),
      buttonText: this.translationService.getStringTranslation('doctors_section.hero_button')
    };

    this.translations = {
      section_title: this.translationService.getStringTranslation('doctors_section.section_title'),
      section_subtitle: this.translationService.getStringTranslation('doctors_section.section_subtitle'),
      search_placeholder: this.translationService.getStringTranslation('doctors_section.search_placeholder'),
      book_consultation: this.translationService.getStringTranslation('doctors_section.book_consultation'),
      book_now: this.translationService.getStringTranslation('doctors_section.book_now'),
      book_appointment: this.translationService.getStringTranslation('doctors_section.book_appointment')
    };
  }

  private loadAllDoctors() {
    this.doctorsService.getAllDoctors().subscribe({
      next: (doctors: Doctor[]) => {
        this.doctors = doctors.map(doctor => ({
          ...doctor,
          rating: 5,
          yearsOfExperience: doctor.yearsOfExperience || 0
        }));
        this.filteredDoctors = [...this.doctors];
      },
      error: (error: any) => {
        console.error('Error fetching doctors:', error);
      }
    });
  }

  filterDoctors() {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredDoctors = [...this.doctors];
      return;
    }
    this.filteredDoctors = this.doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialization.toLowerCase().includes(query)
    );
  }

  scrollToDoctors() {
    if (this.doctorsSection) {
      this.doctorsSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  bookAppointment(doctor: DisplayDoctor) {
    this.router.navigate(['/appointment'], { state: { doctor } });
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  getStarArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    return new Array(fullStars).fill(0);
  }

  getYearsOfExperience(count: number): string {
    return this.translationService.getStringTranslation('doctors_section.years_of_experience').replace('{count}', count.toString());
  }

  private observeDoctorCards() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    setTimeout(() => {
      const doctorCards = document.querySelectorAll('.doctor-card');
      doctorCards.forEach((card) => observer.observe(card));
    }, 100);
  }

  private observeHeroSection() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isHeroVisible = true;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    if (this.heroSection?.nativeElement) {
      observer.observe(this.heroSection.nativeElement);
    } else {
      setTimeout(() => {
        this.isHeroVisible = true;
      }, 500);
    }
  }
}
