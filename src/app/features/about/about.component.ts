import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class AboutComponent implements OnInit {
  values = [
    { label: 'التميز', description: 'نسعى للريادة في كل ما نقدمه، من الخدمات الطبية إلى تجربة المريض.' },
    { label: 'الجودة', description: 'نلتزم بتقديم خدمات طبية عالية الجودة واتباع معايير سباهي لضمان سلامة المرضى.' },
    { label: 'الاحترام', description: 'نؤمن بتقديم رعاية تشعر المرضى بالتقدير والاحترام في كل خطوة.' },
    { label: 'الشفافية', description: 'نحرص على توضيح وتقديم معلومات دقيقة حول كل علاج وإجراء.' },
    { label: 'الابتكار', description: 'نواكب أحدث التقنيات الطبية لضمان تقديم خدمات فعالة وسريعة.' }
  ];

  ngOnInit(): void {}
}
