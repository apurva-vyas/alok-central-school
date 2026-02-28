import { Component, HostListener } from '@angular/core';
import { SCHOOL_INFO } from './shared/school-info';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = SCHOOL_INFO.name;
  whatsappUrl = SCHOOL_INFO.whatsappChatUrl;
  isScrolled = false;

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 60;
  }
}
