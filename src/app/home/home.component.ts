import { Component } from '@angular/core';
import { SCHOOL_INFO } from '../shared/school-info';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  school = SCHOOL_INFO;

  stats = [
    { number: '20', suffix: '+', label: 'Years of Excellence' },
    { number: '1000', suffix: '+', label: 'Students' },
    { number: '50', suffix: '+', label: 'Expert Teachers' },
    { number: '100', suffix: '%', label: 'Board Results' },
  ];
}
