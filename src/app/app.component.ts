import { Component, HostListener } from '@angular/core';
import { SCHOOL_INFO } from './shared/school-info';
import { SeoService } from './shared/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = SCHOOL_INFO.name;
  whatsappUrl = SCHOOL_INFO.whatsappChatUrl;
  isScrolled = false;

  constructor(private seo: SeoService) {
    this.seo.init();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 60;
  }
}
