import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-section.component.html',
  styleUrls: ['./stats-section.component.scss']
})
export class StatsSectionComponent implements AfterViewInit {
  ringDasharray = 226; // Circumference for radius 36 (2 * π * 36 ≈ 226)
  stats = [
    { label: 'عدد العملاء', count: 15000, prefix: '+', suffix: '', ringOffset: 0 },
    { label: 'عدد العيادات', count: 1000, prefix: '+', suffix: '', ringOffset: 0 },
    { label: 'عدد الأطباء', count: 200, prefix: '+', suffix: '', ringOffset: 0 },
    { label: 'ساعات العمل', count: '24/7', prefix: '', suffix: '', ringOffset: 0 }
  ];

  @ViewChildren('counter') counters!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.counters.forEach((counter, index) => {
              const element = counter.nativeElement;
              const targetValue = this.stats[index].count;

              // Handle 24/7 case
              if (typeof targetValue === 'string') {
                element.textContent = targetValue;
                return;
              }

              const target = parseInt(targetValue.toString(), 10);
              let current = 0;
              const duration = 2500; // 2.5 seconds for smoother animation
              const increment = target / (duration / 16); // 60 FPS

              const updateCounter = () => {
                current += increment;
                if (current >= target) {
                  current = target;
                  element.textContent = Math.floor(current).toLocaleString();
                  clearInterval(timer);
                } else {
                  element.textContent = Math.floor(current).toLocaleString();
                }
              };

              const timer = setInterval(updateCounter, 16);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }
}
