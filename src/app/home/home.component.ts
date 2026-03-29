import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { SCHOOL_INFO } from '../shared/school-info';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  school = SCHOOL_INFO;

  stats = [
    { number: '20', suffix: '+', label: 'Years of Excellence', display: '0' },
    { number: '1000', suffix: '+', label: 'Students', display: '0' },
    { number: '50', suffix: '+', label: 'Expert Teachers', display: '0' },
    { number: '100', suffix: '%', label: 'Board Results', display: '0' },
  ];

  @ViewChild('statsSection') statsSection!: ElementRef<HTMLElement>;
  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.zone.run(() => this.animateCounters());
          }
        },
        { threshold: 0.3 }
      );
      this.observer.observe(this.statsSection.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private animateCounters(): void {
    const duration = 1600;
    const frameDuration = 16;
    const totalFrames = Math.round(duration / frameDuration);

    this.stats.forEach((stat) => {
      const target = parseInt(stat.number, 10);
      let frame = 0;

      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        stat.display = current.toLocaleString();

        if (frame >= totalFrames) {
          stat.display = target.toLocaleString();
          clearInterval(counter);
        }
      }, frameDuration);
    });
  }
}
