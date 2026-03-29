import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  NgZone,
  Renderer2,
} from '@angular/core';

@Directive({ selector: '[appReveal]' })
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  @Input('appReveal') revealType:
    | 'fade-up'
    | 'fade-down'
    | 'fade-in'
    | 'slide-left'
    | 'slide-right'
    | 'scale-up'
    | '' = '';

  @Input() revealDelay = 0;
  @Input() revealThreshold = 0.15;

  private observer: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    const type = this.revealType || 'fade-up';
    this.renderer.addClass(this.el.nativeElement, 'reveal');
    this.renderer.addClass(this.el.nativeElement, `reveal--${type}`);

    if (this.revealDelay > 0) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'transitionDelay',
        `${this.revealDelay}ms`
      );
    }

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(this.el.nativeElement, 'is-visible');
            this.observer?.unobserve(this.el.nativeElement);
          }
        },
        { threshold: this.revealThreshold }
      );
      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
