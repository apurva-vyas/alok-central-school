import { Component } from '@angular/core';
import { IMAGES } from '../shared/image-registry';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  heroImage = IMAGES.campus.cbseHero;
  images = [...IMAGES.results];




  
  
}
