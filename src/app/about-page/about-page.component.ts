import { Component } from '@angular/core';
import { IMAGES } from '../shared/image-registry';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent {
  heroImage = IMAGES.campus.cbseHero;
}
