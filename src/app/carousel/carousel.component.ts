import { NgFor } from '@angular/common';

import { Component, OnInit, ViewChild } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { NgbCarousel, NgbCarouselModule, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';






@Component({

  selector: 'app-carousel',

  templateUrl: './carousel.component.html',

  styleUrls: ['./carousel.component.css'],

  standalone: true,

  imports: [NgbCarouselModule, NgFor, FormsModule],




})





export class CarouselComponent {

  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;




  images = ['/assets/school6.jpg', '/assets/school2.jpg'];




  paused = false;

  unpauseOnArrow = true;

  pauseOnIndicator = true;

  pauseOnHover = true;

  pauseOnFocus = true;





  togglePaused() {

    if (this.paused) {

      this.carousel.cycle();

    } else {

      this.carousel.pause();

    }

    this.paused = !this.paused;

  }




  onSlide(slideEvent: NgbSlideEvent) {

    if (

      this.unpauseOnArrow &&

      slideEvent.paused &&

      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)

    ) {

      this.togglePaused();

    }

    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {

      this.togglePaused();

    }

  }

}









