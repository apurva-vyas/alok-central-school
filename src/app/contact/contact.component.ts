import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SCHOOL_INFO } from '../shared/school-info';
import { IMAGES } from '../shared/image-registry';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  heroImage = IMAGES.campus.cbseHero;
  school = SCHOOL_INFO;
  contactFormUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.contactFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl(SCHOOL_INFO.contactFormUrl);
  }
}
