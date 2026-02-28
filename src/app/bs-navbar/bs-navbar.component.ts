import { Component, HostListener, Input } from '@angular/core';

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

  @HostListener('document:click')
  closeAllSubmenus() {
    this.isAboutSubmenuOpen = false;
    this.isAdmissionsSubmenuOpen = false;
  }
}
