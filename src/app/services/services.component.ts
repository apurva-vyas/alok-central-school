import { Component } from '@angular/core';
import { IMAGES } from '../shared/image-registry';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  img = IMAGES;
}
