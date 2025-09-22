import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorsService, Doctor } from '../../core/services/doctors.service'; // Ensure correct path

interface DisplayDoctor extends Doctor {
  rating: number;
}

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss'
})
export class DoctorsComponent implements OnInit, AfterViewInit {
  @ViewChild('doctorsSection') doctorsSection!: ElementRef;

  heroData = {
    title: 'نعمل معاً من أجل حياة صحية',
    subtitle: 'أطباؤنا',
    description: 'نقدم خدمات رعاية صحية شاملة مع أطباء ذوي خبرة مكرسين لرفاهيتك وصحتك.',
    buttonText: 'تعرف على فريقنا'
  };

  doctors: DisplayDoctor[] = [];

  constructor(private doctorsService: DoctorsService) {} // Inject the service

  ngOnInit() {
    this.loadAllDoctors();
  }

  ngAfterViewInit() {
    this.observeDoctorCards();
  }

  private loadAllDoctors() {
    this.doctorsService.getAllDoctors().subscribe({
      next: (doctors: Doctor[]) => {
        this.doctors = doctors.map(doctor => ({
          ...doctor,
          rating: 5 // Assign 5-star rating to all doctors
        }));
      },
      error: (error: any) => {
        console.error('Error fetching doctors:', error);
        // Optionally handle error, e.g., show toast or fallback to hardcoded data
      }
    });
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
}
