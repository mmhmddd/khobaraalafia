import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;
  faqs = [
    { question: 'ما هي ساعات العمل؟', answer: 'نعمل على مدار الساعة، 24/7، لضمان تقديم الدعم في أي وقت تحتاجه.', isOpen: false },
    { question: 'كيف يمكنني التواصل مع الدعم؟', answer: 'يمكنك التواصل عبر البريد الإلكتروني (khobaraalafia@gmail.com) أو الهاتف (0551221322، 0551028800، 0112100329) أو من خلال نموذج الاتصال.', isOpen: false },
    { question: 'هل تقدمون خدمات في جميع أنحاء الرياض؟', answer: 'نعم، نقدم خدماتنا في جميع أحياء الرياض، بما في ذلك حي القادسية وغيره.', isOpen: false },
    { question: 'ما مدة الاستجابة للاستفسارات؟', answer: 'نسعى للرد على الاستفسارات خلال 24 ساعة من تلقي طلبك.', isOpen: false }
  ];

  contactItems = [
    {
      title: 'البريد الإلكتروني',
      details: 'khobaraalafia@gmail.com',
      iconPath1: 'M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z',
      iconPolyline: '22,6 12,13 2,6'
    },
    {
      title: 'الهاتف',
      details: '0551221322<br>0551028800<br>0112100329',
      iconPath1: 'M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59334 1.99522 8.06307 2.16708 8.43099 2.48353C8.79891 2.79999 9.04 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z'
    },
    {
      title: 'العنوان',
      details: 'الرياض - حي القادسية - طريق الامام عبدالله بن سعود 3',
      iconPath1: 'M21 10C21 17 12 21 12 21S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z',
      iconCircle: { cx: '12', cy: '10', r: '3' }
    },
    {
      title: 'ساعات العمل',
      details: '24/7 - على مدار الساعة',
      iconCircle: { cx: '12', cy: '12', r: '10' },
      iconPolyline: '12,6 12,12 16,14'
    }
  ];

  @ViewChildren('animateSection') animateSections!: QueryList<ElementRef>;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    console.log('ContactComponent initialized');
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.classList.add('animate-in');
            element.style.setProperty('--index', index.toString());
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.2 }
    );

    this.animateSections.forEach((section) => {
      observer.observe(section.nativeElement);
    });
  }

  scrollToSection(): void {
    const section = document.getElementById('target-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form Submitted:', this.contactForm.value);
      this.contactForm.reset();
    } else {
      console.log('Form is invalid');
      this.contactForm.markAllAsTouched();
    }
  }

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
