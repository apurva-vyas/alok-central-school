import { Component } from '@angular/core';
import { SCHOOL_INFO } from '../shared/school-info';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  school = SCHOOL_INFO;
}
