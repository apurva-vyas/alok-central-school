import { Component, HostListener, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IMAGES } from '../shared/image-registry';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent {
  @Input() isScrolled = false;
  isMenuCollapsed = true;
  isAboutSubmenuOpen = false;
  logo = IMAGES.branding.logo;
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
    });
  }

  toggleAboutSubmenu(event: Event) {
    event.stopPropagation();
    this.isAboutSubmenuOpen = !this.isAboutSubmenuOpen;
  }

  closeMenu() {
    this.isMenuCollapsed = true;
    this.isAboutSubmenuOpen = false;
  }

  @HostListener('document:click')
  closeAllSubmenus() {
    this.isAboutSubmenuOpen = false;
  }
}
