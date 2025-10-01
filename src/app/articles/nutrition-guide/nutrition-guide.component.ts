import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nutrition-guide',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nutrition-guide.component.html',
  styleUrls: ['./nutrition-guide.component.scss']
})
export class NutritionGuideComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.title.setTitle('دليل التغذية الصحية - علاجات متميزة لأسلوب حياة صحي');
    this.meta.updateTag({ name: 'description', content: 'دليل شامل للتغذية الصحية مع توصيات منظمة الصحة العالمية للبالغين والأطفال، للوقاية من الأمراض وتعزيز الصحة.' });
    this.meta.updateTag({ name: 'keywords', content: 'تغذية صحية, نظام غذائي صحي, دليل تغذية, فوائد الغذاء الصحي, توصيات WHO' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ rel: 'canonical', href: 'https://your-site.com/articles/nutrition-guide' });

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "دليل التغذية الصحية",
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
      "image": "/assets/images/articles/nutrition.jpg",
      "description": "توصيات شاملة لنظام غذائي صحي للوقاية من الأمراض.",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://your-site.com/articles/nutrition-guide"
      }
    });
    document.head.appendChild(script);
  }

  shareOnFacebook(): void {
    const url = encodeURIComponent('https://your-site.com/articles/nutrition-guide');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  shareOnTwitter(): void {
    const url = encodeURIComponent('https://your-site.com/articles/nutrition-guide');
    const text = encodeURIComponent('دليل التغذية الصحية - نصائح لأسلوب حياة صحي');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }

  shareOnWhatsApp(): void {
    const url = encodeURIComponent('https://your-site.com/articles/nutrition-guide');
    const text = encodeURIComponent('دليل التغذية الصحية - نصائح لأسلوب حياة صحي');
    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
  }
}
