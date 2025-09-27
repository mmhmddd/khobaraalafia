import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mental-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mental-health.component.html',
  styleUrls: ['./mental-health.component.scss']
})
export class MentalHealthComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.title.setTitle('أهمية الصحة النفسية - علاجات متميزة');

    this.meta.updateTag({
      name: 'description',
      content: 'اكتشف أهمية الصحة النفسية وتأثيرها على الحياة اليومية، مع نصائح لتعزيز الرفاهية العامة.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content: 'صحة نفسية, أهمية الصحة النفسية, تعزيز الصحة النفسية, اضطرابات نفسية, الرفاهية العاطفية'
    });

    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    this.meta.updateTag({ rel: 'canonical', href: 'https://your-site.com/articles/mental-health' });

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "أهمية الصحة النفسية",
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
      "image": "https://your-site.com/assets/images/articles/mental-health.jpg",
      "description": "مقال شامل عن أهمية الصحة النفسية وطرق تعزيزها لتحسين جودة الحياة.",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://your-site.com/articles/mental-health"
      },
      "keywords": "صحة نفسية, أهمية الصحة النفسية, تعزيز الصحة النفسية"
    });
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/assets/images/articles/mental-health.jpg';
    document.head.appendChild(link);
  }

  shareArticle(platform: string): void {
    const url = 'https://your-site.com/articles/mental-health';
    const title = 'أهمية الصحة النفسية';
    const text = 'اكتشف أهمية الصحة النفسية ونصائح لتحسين الرفاهية!';

    if (navigator.share) {
      navigator.share({
        title,
        text,
        url
      }).catch(error => console.error('Error sharing:', error));
    } else if (platform === 'mental-health') {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(shareUrl, '_blank');
    } else if (platform === 'mental-health') {
      const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      window.open(shareUrl, '_blank');
    }
  }
}
