import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface RelatedArticle {
  path: string;
  title: string;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-heart-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heart-health.component.html',
  styleUrls: ['./heart-health.component.scss']
})
export class HeartHealthComponent implements OnInit {
  relatedArticles: RelatedArticle[] = [
    {
      path: '/articles/mental-health',
      title: 'أهمية الصحة النفسية',
      image: '/assets/images/articles/mental-health.jpg',
      alt: 'صورة توضيحية للصحة النفسية'
    },
    {
      path: '/articles/nutrition-guide',
      title: 'دليل التغذية الصحية',
      image: '/assets/images/articles/nutrition.jpg',
      alt: 'صورة توضيحية للتغذية الصحية'
    }
  ];

  constructor(private title: Title, private meta: Meta, private router: Router) {}

  ngOnInit(): void {
    // SEO: Page title
    this.title.setTitle('كيف تحافظ على صحة قلبك - علاجات متميزة');

    // SEO: Meta description
    this.meta.updateTag({
      name: 'description',
      content: 'تعرف على أفضل الاستراتيجيات للوقاية من أمراض القلب من خلال التغذية، التمارين، والفحوصات الدورية.'
    });

    // SEO: Keywords
    this.meta.updateTag({
      name: 'keywords',
      content: 'صحة القلب, الوقاية من أمراض القلب, تغذية صحية, تمارين القلب, إقلاع عن التدخين, ضغط الدم, الكوليسترول'
    });

    // SEO: Robots
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    // SEO: Canonical URL
    this.meta.updateTag({ rel: 'canonical', href: 'https://your-site.com/articles/heart-health' });

    // SEO: Structured Data (JSON-LD)
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "كيف تحافظ على صحة قلبك",
      "author": {
        "@type": "Organization",
        "name": "فريق التحرير"
      },
      "publisher": {
        "@type": "Organization",
        "name": "علاجات متميزة",
        "logo": {
          "@type": "ImageObject",
          "url": "https://your-site.com/assets/images/logo.png"
        }
      },
      "datePublished": "2025-09-27",
      "dateModified": "2025-09-27",
      "image": "https://your-site.com/assets/images/articles/heart-health.jpg",
      "description": "دليل شامل للحفاظ على صحة القلب مع نصائح عملية مدعومة علميًا للوقاية من أمراض القلب.",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://your-site.com/articles/heart-health"
      },
      "keywords": "صحة القلب, الوقاية من أمراض القلب, تغذية صحية, تمارين القلب"
    });
    document.head.appendChild(script);

    // Preload critical image for performance
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/assets/images/articles/heart-health.jpg';
    document.head.appendChild(link);
  }

  shareArticle(platform: string): void {
    const url = 'https://your-site.com/articles/heart-health';
    const title = 'كيف تحافظ على صحة قلبك';
    const text = 'تعرف على أفضل الاستراتيجيات للوقاية من أمراض القلب!';

    if (navigator.share) {
      navigator.share({
        title,
        text,
        url
      }).catch(error => console.error('Error sharing:', error));
    } else if (platform === 'facebook') {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(shareUrl, '_blank');
    } else if (platform === 'twitter') {
      const shareUrl = `https://x.com/W_E_Medical/status/1888319215918096538`;
      window.open(shareUrl, '_blank');
    } else if (platform === 'whatsapp') {
      const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
      window.open(shareUrl, '_blank');
    }
  }
}
