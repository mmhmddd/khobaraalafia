import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorsService, Doctor } from '../../core/services/doctors.service';

interface DisplayDoctor extends Doctor {
  rating: number;
}

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss'
})
export class DoctorsComponent implements OnInit, AfterViewInit {
  @ViewChild('doctorsSection') doctorsSection!: ElementRef;
  @ViewChild('heroSection') heroSection!: ElementRef;

  heroData = {
    title: 'رعاية صحية بمعايير عالمية',
    subtitle: 'أطباؤنا المتميزون',
    description: 'ابحث عن أفضل الأطباء المتخصصين لتقديم الرعاية الصحية التي تستحقها، مع خبرة وتفانٍ لضمان سلامتك.',
    buttonText: 'استكشف فريقنا'
  };

  doctors: DisplayDoctor[] = [];
  filteredDoctors: DisplayDoctor[] = [];
  searchQuery: string = '';
  isHeroVisible: boolean = false;

  constructor(private doctorsService: DoctorsService) {}

  ngOnInit() {
    this.loadAllDoctors();
  }

  ngAfterViewInit() {
    this.observeDoctorCards();
    this.observeHeroSection();
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
    console.log('Booking appointment with:', doctor.name);
    this.showBookingConfirmation(doctor);
  }

  private showBookingConfirmation(doctor: DisplayDoctor) {
    alert(`تم اختيار ${doctor.name} للاستشارة. سيتم توجيهك لصفحة الحجز.`);
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  getStarArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    return new Array(fullStars).fill(0);
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
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      {
        threshold: 0.2, // Lower threshold for earlier trigger
        rootMargin: '0px'
      }
    );

    if (this.heroSection?.nativeElement) {
      observer.observe(this.heroSection.nativeElement);
    } else {
      // Fallback: show text if observer fails
      setTimeout(() => {
        this.isHeroVisible = true;
      }, 500);
    }
  }
}
