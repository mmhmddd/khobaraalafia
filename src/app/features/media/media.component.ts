import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { VideoSectionComponent } from "../../shared/video-section/video-section.component";

interface StatCard {
  id: number;
  icon: string;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  animationDelay: number;
  color?: string;
}

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  badgeText: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

interface FloatingCard {
  id: number;
  icon: string;
  text: string;
  position: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  delay: number;
}

interface Article {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [VideoSectionComponent, CommonModule],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss',
  host: {
    '(window:scroll)': 'onWindowScroll($event)',
    '(window:resize)': 'onWindowResize($event)'
  }
})
export class MediaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('counterElements') counterElements!: ElementRef;

  // Component State
  private intersectionObserver!: IntersectionObserver;
  private resizeObserver!: ResizeObserver;
  private hasAnimated = false;
  private animationFrameId?: number;
  private scrollPosition = 0;

  // UI State
  isVisible = false;
  isMobile = false;
  isTablet = false;
  isLoading = true;

  // Hero Content
  heroContent: HeroContent = {
    title: 'علاجات متميزة لأسلوب حياة صحي',
    subtitle: 'الرعاية الصحية المتميزة',
    description: 'نقدم حلول طبية متقدمة مع فريق من الأطباء المتخصصين، باستخدام أحدث التقنيات الطبية لضمان أفضل رعاية صحية لك ولعائلتك.',
    badgeText: '✨ الرعاية الصحية المتميزة',
    primaryButtonText: 'عرض مقاطع الفيديو',
    secondaryButtonText: 'خدماتنا'
  };

  // Statistics Data
  statsData: StatCard[] = [
    {
      id: 1,
      icon: 'fas fa-users',
      value: 4500,
      label: 'عملاء سعداء',
      suffix: '+',
      animationDelay: 100,
      color: '#00B4D8'
    },
    {
      id: 2,
      icon: 'fas fa-bed',
      value: 200,
      label: 'غرفة مستشفى',
      suffix: '+',
      animationDelay: 200,
      color: '#00D68F'
    },
    {
      id: 3,
      icon: 'fas fa-user-md',
      value: 2500,
      label: 'أطباء أونلاين',
      suffix: '+',
      animationDelay: 300,
      color: '#06B6D4'
    },
    {
      id: 4,
      icon: 'fas fa-ambulance',
      value: 20,
      label: 'سيارة إسعاف',
      suffix: '+',
      animationDelay: 400,
      color: '#059669'
    }
  ];

  // Floating Cards Data
  floatingCards: FloatingCard[] = [
    {
      id: 1,
      icon: 'fas fa-heartbeat',
      text: 'رعاية القلب',
      position: 'top-right',
      delay: 0
    },
    {
      id: 2,
      icon: 'fas fa-shield-alt',
      text: 'حماية صحية',
      position: 'bottom-right',
      delay: 2000
    },
    {
      id: 3,
      icon: 'fas fa-clock',
      text: '24/7 خدمة',
      position: 'top-left',
      delay: 4000
    }
  ];

  // Articles Data
  articles: Article[] = [
    {
      id: 1,
      title: 'كيف تحافظ على صحة قلبك',
      description: 'تعرف على أفضل الممارسات للحفاظ على صحة القلب من خلال التغذية السليمة، التمارين الرياضية، وإدارة الإجهاد.',
      image: '/assets/images/articles/heart-health.jpg',
      link: '/articles/heart-health'
    },
    {
      id: 2,
      title: 'أهمية الصحة النفسية',
      description: 'اكتشف كيف يمكن للصحة النفسية أن تؤثر على حياتك اليومية وتعلم استراتيجيات لتحسين سلامتك العقلية.',
      image: '/assets/images/articles/mental-health.jpg',
      link: '/articles/mental-health'
    },
    {
      id: 3,
      title: 'دليل التغذية الصحية',
      description: 'نصائح عملية لتحسين نظامك الغذائي واختيار الأطعمة التي تعزز صحتك وطاقتك اليومية.',
      image: '/assets/images/articles/nutrition.jpg',
      link: '/articles/nutrition'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeComponent();
      this.checkDeviceType();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.setupObservers();
        this.initializeAnimations();
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // Initialization Methods
  private initializeComponent(): void {
    this.setupEventListeners();
    this.preloadImages();
  }

  private setupObservers(): void {
    this.setupIntersectionObserver();
    this.setupResizeObserver();
    this.observeElements();
  }

  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: [0.1, 0.3, 0.5, 0.7, 0.9]
    };

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const ratio = entry.intersectionRatio;

          if (entry.isIntersecting && ratio >= 0.3) {
            if (!this.hasAnimated) {
              this.startAnimationSequence();
              this.hasAnimated = true;
            }
            this.isVisible = true;
          } else if (ratio < 0.1) {
            this.isVisible = false;
          }

          // Update visibility for parallax effects
          this.updateParallaxEffects(ratio);
        });
      },
      options
    );
  }

  private setupResizeObserver(): void {
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(entries => {
        this.handleResize();
      });
    }
  }

  private observeElements(): void {
    if (this.counterElements?.nativeElement) {
      this.intersectionObserver.observe(this.counterElements.nativeElement);

      if (this.resizeObserver) {
        this.resizeObserver.observe(this.counterElements.nativeElement);
      }
    }
  }

  // Animation Methods
  private startAnimationSequence(): void {
    // Animate stats with staggered delays
    this.statsData.forEach((stat) => {
      setTimeout(() => {
        this.animateCounter(stat);
      }, stat.animationDelay);
    });

    // Trigger additional animations
    this.triggerElementAnimations();
    this.animateFloatingCards();
  }

  private animateCounter(stat: StatCard): void {
    const element = this.counterElements?.nativeElement?.querySelector(`[data-stat-id="${stat.id}"] .counter`);
    if (!element) return;

    const duration = 2500;
    const startTime = performance.now();
    const startValue = 0;
    const endValue = stat.value;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Custom easing: ease-out-cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (endValue - startValue) * easedProgress);

      // Update counter display
      element.textContent = this.formatCounterValue(currentValue, stat);

      // Add visual effects during animation
      if (progress < 1) {
        element.style.transform = `scale(${1 + Math.sin(progress * Math.PI) * 0.1})`;
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        element.textContent = this.formatCounterValue(endValue, stat);
        element.style.transform = 'scale(1)';
        this.addCounterCompleteEffect(element);
      }
    };

    requestAnimationFrame(animate);
  }

  private formatCounterValue(value: number, stat: StatCard): string {
    let formattedValue = value.toLocaleString('ar-EG');

    if (stat.prefix) formattedValue = stat.prefix + formattedValue;
    if (stat.suffix) formattedValue = formattedValue + stat.suffix;

    return formattedValue;
  }

  private addCounterCompleteEffect(element: HTMLElement): void {
    element.classList.add('counter-complete');
    setTimeout(() => {
      element.classList.remove('counter-complete');
    }, 500);
  }

  private triggerElementAnimations(): void {
    const animatedElements = this.counterElements?.nativeElement?.querySelectorAll('[data-aos]');
    animatedElements?.forEach((el: HTMLElement, index: number) => {
      setTimeout(() => {
        el.classList.add('aos-animate');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 150);
    });
  }

  private animateFloatingCards(): void {
    this.floatingCards.forEach(card => {
      setTimeout(() => {
        const cardElement = document.querySelector(`[data-floating-card="${card.id}"]`);
        if (cardElement) {
          cardElement.classList.add('animate');
        }
      }, card.delay);
    });
  }

  private updateParallaxEffects(ratio: number): void {
    if (!this.isMobile) {
      const parallaxElements = this.counterElements?.nativeElement?.querySelectorAll('[data-parallax]');
      parallaxElements?.forEach((el: HTMLElement) => {
        const speed = parseFloat(el.dataset['parallax'] || '0.5');
        const yPos = -(this.scrollPosition * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    }
  }

  // Event Handlers
  onWindowScroll(event: Event): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollPosition = window.pageYOffset;

      // Update parallax if visible
      if (this.isVisible && !this.isMobile) {
        requestAnimationFrame(() => {
          this.updateParallaxEffects(1);
        });
      }
    }
  }

  onWindowResize(event: Event): void {
    this.handleResize();
  }

  private handleResize(): void {
    this.checkDeviceType();
    this.cdr.detectChanges();
  }

  private checkDeviceType(): void {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      this.isMobile = width <= 768;
      this.isTablet = width > 768 && width <= 1024;
    }
  }

  // Button Actions
  onViewVideosClick(event: Event): void {
    event.preventDefault();
    this.scrollToSection('#videos-section');
    this.trackButtonClick('view_videos');
  }

  onServicesClick(event: Event): void {
    event.preventDefault();
    this.scrollToSection('#services');
    this.trackButtonClick('services');
  }

  shareArticle(articleId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const article = this.articles.find(a => a.link.includes(articleId));
      if (article && navigator.share) {
        navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.origin + article.link
        }).then(() => {
          this.trackButtonClick(`share_article_${articleId}`);
        }).catch((error) => {
          console.error('Error sharing article:', error);
        });
      } else {
      }
    }
  }

  private scrollToSection(selector: string): void {
    const element = document.querySelector(selector);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Utility Methods
  trackByStatId(index: number, item: StatCard): number {
    return item.id;
  }

  trackByFloatingCard(index: number, item: FloatingCard): number {
    return item.id;
  }

  trackByArticleId(index: number, item: Article): number {
    return item.id;
  }

  getStatIconClass(stat: StatCard): string {
    return `stat-icon ${stat.icon}`;
  }

  getFloatingCardClass(card: FloatingCard): string {
    return `floating-card floating-card-${card.position}`;
  }

  // Performance & Analytics
  private preloadImages(): void {
    const imageUrls = [
      '/assets/images/home/heroimg.png',
      '/assets/images/articles/heart-health.jpg',
      '/assets/images/articles/mental-health.jpg',
      '/assets/images/articles/nutrition.jpg'
    ];

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  private trackButtonClick(buttonName: string): void {
    if (isPlatformBrowser(this.platformId) && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'hero_section',
        event_label: buttonName
      });
    }
  }

  private setupEventListeners(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    }
  }

  private handleKeyboardNavigation(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target as HTMLElement;
      if (target.classList.contains('hero-cta-button') || target.classList.contains('btn-read') || target.classList.contains('btn-share')) {
        event.preventDefault();
        target.click();
      }
    }
  }

  private initializeAnimations(): void {
    if (isPlatformBrowser(this.platformId) && (window as any).AOS) {
      (window as any).AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 120,
        delay: 0,
        disable: this.isMobile ? 'mobile' : false
      });
    }
  }

  // Cleanup
  private cleanup(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    }
  }

  // Legacy support
  startCounters(): void {
    this.startAnimationSequence();
  }

  // Public getters for template
  get isDesktop(): boolean {
    return !this.isMobile && !this.isTablet;
  }

  get shouldShowFloatingCards(): boolean {
    return !this.isMobile && this.isVisible;
  }

  get heroImageClass(): string {
    return `hero-image ${this.isVisible ? 'visible' : ''} ${this.isMobile ? 'mobile' : ''}`;
  }
}
