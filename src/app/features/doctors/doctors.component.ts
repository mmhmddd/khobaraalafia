import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
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
  all_specialties: string;
  no_results: string;
  error_message: string;
  years_of_experience: string;
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
    book_appointment: '',
    all_specialties: '',
    no_results: '',
    error_message: '',
    years_of_experience: ''
  };

  doctors: DisplayDoctor[] = [];
  filteredDoctors: DisplayDoctor[] = [];
  specialties: string[] = [];
  searchQuery: string = '';
  selectedSpecialty: string = '';
  loading: boolean = true;
  errorMessage: string = '';
  isHeroVisible: boolean = false;

  private languageSubscription?: Subscription;
  private searchSubject = new Subject<void>();

  constructor(
    private doctorsService: DoctorsService,
    private translationService: TranslationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTranslations();
    this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(() => {
      this.loadTranslations();
    });
    this.loadAllDoctors();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.filterDoctors();
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
    this.searchSubject.complete();
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
      book_appointment: this.translationService.getStringTranslation('doctors_section.book_appointment'),
      all_specialties: this.translationService.getStringTranslation('doctors_section.all_specialties') || 'All Specialties',
      no_results: this.translationService.getStringTranslation('doctors_section.no_results') || 'No doctors found',
      error_message: this.translationService.getStringTranslation('doctors_section.error_message') || 'Error loading doctors',
      years_of_experience: this.translationService.getStringTranslation('doctors_section.years_of_experience')
    };
  }

  private loadAllDoctors() {
    this.loading = true;
    this.doctorsService.getAllDoctors().subscribe({
      next: (doctors: Doctor[]) => {
        this.doctors = doctors.map(doctor => ({
          ...doctor,
          rating: 5, // Placeholder; replace with real rating if available
          yearsOfExperience: doctor.yearsOfExperience || 0
        }));
        this.specialties = [...new Set(this.doctors.map(d => d.specialization))].sort();
        this.filteredDoctors = [...this.doctors];
        this.loading = false;
        this.filterDoctors();
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'An unknown error occurred';
        this.loading = false;
      }
    });
  }

  onSearchInput() {
    this.searchSubject.next();
  }

  filterDoctors() {
    let filtered = [...this.doctors];
    const query = this.searchQuery.toLowerCase().trim();

    if (query) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query)
      );
    }

    if (this.selectedSpecialty) {
      filtered = filtered.filter(doctor => doctor.specialization === this.selectedSpecialty);
    }

    this.filteredDoctors = filtered;
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
    return this.translations.years_of_experience.replace('{count}', count.toString());
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
