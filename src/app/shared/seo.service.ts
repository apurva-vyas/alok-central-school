import { Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SeoData {
  title: string;
  description: string;
  breadcrumb: string;
}

const SITE = 'Alok Central School, Shahpura';
const BASE_URL = 'https://www.alokcentralschool.in';
const DEFAULT_TITLE = `${SITE} — Best School in Shahpura, Bhilwara`;
const DEFAULT_DESC =
  'Alok Central School is the leading co-educational school in Shahpura, Bhilwara, Rajasthan. Established in 2002, offering quality education from Pre-Primary to Class 10 with 100% board results.';

const ROUTE_SEO: Record<string, SeoData> = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    breadcrumb: 'Home',
  },
  '/about': {
    title: `About Us — ${SITE} | Best School in Shahpura`,
    description:
      'Learn about Alok Central School, Shahpura — our mission, vision, and 20+ years of academic excellence in Shahpura, Bhilwara, Rajasthan.',
    breadcrumb: 'About Us',
  },
  '/services': {
    title: `Facilities & Services — ${SITE}`,
    description:
      'Explore world-class facilities at Alok Central School, Shahpura — science lab, computer lab, Atal Tinkering Lab, library, music rooms, transport, playground, and more.',
    breadcrumb: 'Facilities',
  },
  '/admission': {
    title: `Admissions Open — ${SITE} | Apply Now`,
    description:
      'Apply for admission at Alok Central School, Shahpura, Bhilwara. Enrol your child in the best school in Shahpura from Pre-Primary to Class 10.',
    breadcrumb: 'Admissions',
  },
  '/contact': {
    title: `Contact Us — ${SITE} | Shahpura, Bhilwara`,
    description:
      'Contact Alok Central School, Shahpura, Bhilwara, Rajasthan. Phone: 01484-222244, Mobile: 9413270929. Visit us at NH 148D, Kalyanpura, Shahpura Rural 311404.',
    breadcrumb: 'Contact Us',
  },
  '/gallery': {
    title: `Photo Gallery — ${SITE}`,
    description:
      'View photos of Alok Central School, Shahpura — campus, events, celebrations, and student activities at the best school in Shahpura, Bhilwara.',
    breadcrumb: 'Gallery',
  },
  '/moments': {
    title: `Moments — ${SITE}`,
    description:
      'Memorable moments from Alok Central School, Shahpura — events, cultural programs, sports days, and student achievements.',
    breadcrumb: 'Moments',
  },
  '/videos': {
    title: `Video Gallery — ${SITE}`,
    description:
      'Watch videos of events, programs, and activities at Alok Central School, Shahpura, Bhilwara, Rajasthan.',
    breadcrumb: 'Videos',
  },
  '/faculty': {
    title: `Our Faculty — ${SITE} | Expert Teachers in Shahpura`,
    description:
      'Meet the dedicated and experienced faculty of Alok Central School, Shahpura. 50+ expert teachers providing quality education in Bhilwara district.',
    breadcrumb: 'Faculty',
  },
  '/results': {
    title: `Board Results — ${SITE} | 100% Results`,
    description:
      'Board examination results of Alok Central School, Shahpura. 100% pass rate — the top-performing school in Shahpura, Bhilwara, Rajasthan.',
    breadcrumb: 'Board Results',
  },
  '/cbse': {
    title: `CBSE Information — ${SITE}`,
    description:
      'CBSE affiliation and academic information for Alok Central School, Shahpura, Bhilwara, Rajasthan.',
    breadcrumb: 'CBSE',
  },
  '/result': {
    title: `Student Results — ${SITE}`,
    description:
      'Check individual student results from Alok Central School, Shahpura, Bhilwara.',
    breadcrumb: 'Results',
  },
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Which is the best school in Shahpura, Bhilwara?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alok Central School is widely regarded as one of the best schools in Shahpura, Bhilwara. Established in 2002, it offers quality education from Pre-Primary to Class 10 with 50+ expert teachers, modern facilities, and a consistent 100% board pass rate.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Alok Central School located in Shahpura?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alok Central School is located at NH 148D, Kalyanpura, Shahpura Rural, Rajasthan 311404, India. It is situated in Shahpura block, Bhilwara district, easily accessible from the main highway.',
      },
    },
    {
      '@type': 'Question',
      name: 'What classes does Alok Central School, Shahpura offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alok Central School offers education from Pre-Primary (Nursery, LKG, UKG) to Class 10 as a co-educational institution. The school follows a CBSE-pattern curriculum.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to get admission in Alok Central School, Shahpura?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can apply for admission online through our website at www.alokcentralschool.in or visit the school at NH 148D, Kalyanpura, Shahpura Rural. Contact us at 01484-222244 or 9413270929 for admission details. The academic session starts in April.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the fees for Alok Central School, Shahpura?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alok Central School offers quality education at competitive fees. For the latest fee structure, please contact the school office at 01484-222244 or 9413270929, or visit us at NH 148D, Kalyanpura, Shahpura.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Alok Central School a CBSE school in Shahpura?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Alok Central School follows a CBSE-pattern curriculum and provides quality education from Pre-Primary to Class 10 in Shahpura, Bhilwara, Rajasthan.',
      },
    },
    {
      '@type': 'Question',
      name: 'What facilities does Alok Central School, Shahpura have?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alok Central School has modern facilities including a Science Lab, Computer Lab, Atal Tinkering Lab, Library with 200+ books, Music Rooms, Playground, Transport Services, Canteen, 24x7 Security, and dedicated rooms for co-curricular activities.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there an English medium school in Shahpura, Bhilwara?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Alok Central School in Shahpura provides education with Hindi as the primary medium of instruction along with strong English language training.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the board result of Alok Central School?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alok Central School has a consistent 100% board examination pass rate. The school is known as one of the top-performing schools in Shahpura, Bhilwara district for board results.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Alok Central School have transport facility in Shahpura?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Alok Central School provides transport facility covering Shahpura town and surrounding rural areas in Bhilwara district.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which is the top private school near Shahpura, Rajasthan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alok Central School is one of the top private schools near Shahpura, Rajasthan. With over 20 years of academic excellence, 1000+ students, and modern infrastructure, it is a preferred choice for parents in Shahpura and surrounding areas of Bhilwara district.',
      },
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private titleService: Title,
    private meta: Meta,
    private router: Router,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  init(): void {
    this.injectFaqSchema();

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        const path = url.split('?')[0].split('#')[0];
        const seo = ROUTE_SEO[path] ?? {
          title: DEFAULT_TITLE,
          description: DEFAULT_DESC,
          breadcrumb: '',
        };

        this.titleService.setTitle(seo.title);
        this.meta.updateTag({ name: 'description', content: seo.description });
        this.meta.updateTag({ property: 'og:title', content: seo.title });
        this.meta.updateTag({
          property: 'og:description',
          content: seo.description,
        });
        this.meta.updateTag({
          property: 'og:url',
          content: `${BASE_URL}${path === '/' ? '' : path}`,
        });
        this.meta.updateTag({ name: 'twitter:title', content: seo.title });
        this.meta.updateTag({
          name: 'twitter:description',
          content: seo.description,
        });

        const canonical = this.doc.querySelector(
          'link[rel="canonical"]'
        ) as HTMLLinkElement;
        if (canonical) {
          canonical.href = `${BASE_URL}${path === '/' ? '' : path}`;
        }

        this.updateBreadcrumb(path, seo.breadcrumb);
      });
  }

  private updateBreadcrumb(path: string, label: string): void {
    const id = 'breadcrumb-jsonld';
    this.doc.getElementById(id)?.remove();

    const items: { name: string; url: string }[] = [
      { name: 'Home', url: BASE_URL },
    ];
    if (path !== '/') {
      items.push({ name: label, url: `${BASE_URL}${path}` });
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    };

    const script = this.doc.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    this.doc.head.appendChild(script);
  }

  private injectFaqSchema(): void {
    const script = this.doc.createElement('script');
    script.id = 'faq-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(FAQ_SCHEMA);
    this.doc.head.appendChild(script);
  }
}
