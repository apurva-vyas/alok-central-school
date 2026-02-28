import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-hero',
  template: `
    <section class="page-hero">
      <img [src]="image" [alt]="title">
      <h1 class="page-hero-title">{{ title }}</h1>
    </section>
  `
})
export class PageHeroComponent {
  @Input() title = '';
  @Input() image = '/assets/School7.jpg';
}
