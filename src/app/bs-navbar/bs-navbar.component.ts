import { Component, HostListener, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IMAGES } from '../shared/image-registry';
import { SCHOOL_INFO } from '../shared/school-info';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent {
  @Input() isScrolled = false;
  isMenuCollapsed = true;
  isAboutSubmenuOpen = false;
  isAuthDropdownOpen = false;
  logo = IMAGES.branding.logo;
  school = SCHOOL_INFO;

  constructor(private router: Router, public authService: AuthService) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
    });
  }

  toggleAboutSubmenu(event: Event) {
    event.stopPropagation();
    this.isAboutSubmenuOpen = !this.isAboutSubmenuOpen;
    this.isAuthDropdownOpen = false;
  }

  toggleAuthDropdown(event: Event) {
    event.stopPropagation();
    this.isAuthDropdownOpen = !this.isAuthDropdownOpen;
    this.isAboutSubmenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }

  closeMenu() {
    this.isMenuCollapsed = true;
    this.isAboutSubmenuOpen = false;
    this.isAuthDropdownOpen = false;
  }

  @HostListener('document:click')
  closeAllSubmenus() {
    this.isAboutSubmenuOpen = false;
    this.isAuthDropdownOpen = false;
  }
}
