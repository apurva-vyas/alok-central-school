import { Component, HostListener, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent {
  @Input() isScrolled = false;
  isMenuCollapsed = true;
  isAboutSubmenuOpen = false;
  isAdmissionsSubmenuOpen = false;

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
    this.isAdmissionsSubmenuOpen = false;
  }

  toggleAdmissionsSubmenu(event: Event) {
    event.stopPropagation();
    this.isAdmissionsSubmenuOpen = !this.isAdmissionsSubmenuOpen;
    this.isAboutSubmenuOpen = false;
  }

  closeMenu() {
    this.isMenuCollapsed = true;
    this.isAboutSubmenuOpen = false;
    this.isAdmissionsSubmenuOpen = false;
  }

  @HostListener('document:click')
  closeAllSubmenus() {
    this.isAboutSubmenuOpen = false;
    this.isAdmissionsSubmenuOpen = false;
  }
}
