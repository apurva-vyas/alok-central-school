import { Component } from '@angular/core';
import { SCHOOL_INFO } from '../shared/school-info';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  school = SCHOOL_INFO;
  currentYear = new Date().getFullYear();
}
