import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SeoData {
  title: string;
  description: string;
}

const SITE_NAME = 'Alok Central School, Shahpura';
const DEFAULT_TITLE = 'Alok Central School, Shahpura — Best School in Shahpura, Bhilwara';
const DEFAULT_DESC =
  'Alok Central School is the leading co-educational school in Shahpura, Bhilwara, Rajasthan. Established in 2002, offering quality education from Pre-Primary to Class 10 with 100% board results.';

const ROUTE_SEO: Record<string, SeoData> = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
  },
  '/about': {
    title: `About Us — ${SITE_NAME} | Best School in Shahpura`,
    description:
      'Learn about Alok Central School, Shahpura — our mission, vision, and 20+ years of academic excellence in Shahpura, Bhilwara, Rajasthan.',
  },
  '/services': {
    title: `Facilities & Services — ${SITE_NAME}`,
    description:
      'Explore world-class facilities at Alok Central School, Shahpura — science lab, computer lab, Atal Tinkering Lab, library, music rooms, transport, playground, and more.',
  },
  '/admission': {
    title: `Admissions Open — ${SITE_NAME} | Apply Now`,
    description:
      'Apply for admission at Alok Central School, Shahpura, Bhilwara. Enrol your child in the best school in Shahpura from Pre-Primary to Class 10.',
  },
  '/contact': {
    title: `Contact Us — ${SITE_NAME} | Shahpura, Bhilwara`,
    description:
      'Contact Alok Central School, Shahpura, Bhilwara, Rajasthan. Phone: 01484-222244, Mobile: 9413270929. Visit us at NH 148D, Kalyanpura, Shahpura Rural 311404.',
  },
  '/gallery': {
    title: `Photo Gallery — ${SITE_NAME}`,
    description:
      'View photos of Alok Central School, Shahpura — campus, events, celebrations, and student activities at the best school in Shahpura, Bhilwara.',
  },
  '/moments': {
    title: `Moments — ${SITE_NAME}`,
    description:
      'Memorable moments from Alok Central School, Shahpura — events, cultural programs, sports days, and student achievements.',
  },
  '/videos': {
    title: `Video Gallery — ${SITE_NAME}`,
    description:
      'Watch videos of events, programs, and activities at Alok Central School, Shahpura, Bhilwara, Rajasthan.',
  },
  '/faculty': {
    title: `Our Faculty — ${SITE_NAME} | Expert Teachers in Shahpura`,
    description:
      'Meet the dedicated and experienced faculty of Alok Central School, Shahpura. 50+ expert teachers providing quality education in Bhilwara district.',
  },
  '/results': {
    title: `Board Results — ${SITE_NAME} | 100% Results`,
    description:
      'Board examination results of Alok Central School, Shahpura. 100% pass rate — the top-performing school in Shahpura, Bhilwara, Rajasthan.',
  },
  '/cbse': {
    title: `CBSE Information — ${SITE_NAME}`,
    description:
      'CBSE affiliation and academic information for Alok Central School, Shahpura, Bhilwara, Rajasthan.',
  },
  '/result': {
    title: `Student Results — ${SITE_NAME}`,
    description:
      'Check individual student results from Alok Central School, Shahpura, Bhilwara.',
  },
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private titleService: Title,
    private meta: Meta,
    private router: Router
  ) {}

  init(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        const path = url.split('?')[0].split('#')[0];
        const seo = ROUTE_SEO[path] ?? {
          title: DEFAULT_TITLE,
          description: DEFAULT_DESC,
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
          content: `https://www.alokcentralschool.in${path === '/' ? '' : path}`,
        });
        this.meta.updateTag({
          name: 'twitter:title',
          content: seo.title,
        });
        this.meta.updateTag({
          name: 'twitter:description',
          content: seo.description,
        });

        const canonical = document.querySelector(
          'link[rel="canonical"]'
        ) as HTMLLinkElement;
        if (canonical) {
          canonical.href = `https://www.alokcentralschool.in${path === '/' ? '' : path}`;
        }
      });
  }
}
