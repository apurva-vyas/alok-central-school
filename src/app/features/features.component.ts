import { Component } from '@angular/core';
import { IMAGES } from '../shared/image-registry';

@Component({
  selector: 'features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  img = IMAGES;
}
