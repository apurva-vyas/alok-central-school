import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SCHOOL_INFO } from '../shared/school-info';

@Component({
  selector: 'app-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.css']
})
export class AdmissionsComponent {
  admissionFormUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.admissionFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl(SCHOOL_INFO.admissionFormUrl);
  }
}
