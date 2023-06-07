import { Component } from '@angular/core';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
 

  images: any[] = [
    { src: '/assets/sciencefair/1.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/schooltour/1.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/2.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/3.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/4.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/5.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/6.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/7.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/8.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/9.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/10.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/11.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/12.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/13.jpg', alt: 'school trip', category: 'school trip' },
    { src: '/assets/schooltour/14.jpg', alt: 'school trip', category: 'school trip' },
   
   
    
    { src: '/assets/sciencefair/2.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/sciencefair/3.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/sciencefair/4.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/sciencefair/5.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/sciencefair/6.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/sciencefair/7.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/sciencefair/8.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/sciencefair/9.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/sciencefair/10.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/sciencefair/11.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/sciencefair/12.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/sciencefair/13.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/sciencefair/14.jpg', alt: 'science fair', category: 'science fair' },
    { src: '/assets/jan/1.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/2.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/3.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/4.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/5.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/6.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/7.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/8.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/9.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/10.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/11.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/12.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/13.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/14.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/15.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/16.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/17.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/jan/18.jpg', alt: 'Janmashthami', category: 'Janmashthami' },
    { src: '/assets/anualday/1.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/2.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/3.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/4.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/5.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/6.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/7.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/8.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/9.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/10.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/11.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/12.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/13.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/14.JPG', alt: 'Annual Function', category: 'Annual Function' },

    { src: '/assets/anualday/15.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/16.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/17.JPG', alt: 'Annual Function', category: 'Annual Function' },

    { src: '/assets/anualday/18.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/19.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/20.JPG', alt: 'Annual Function', category: 'Annual Function' },

    { src: '/assets/anualday/21.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/22.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/23.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/24.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/25.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/26.JPG', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/anualday/27.JPG', alt: 'Annual Function', category: 'Annual Function' },

    
    { src: '/assets/papercutting/1.jpg', alt: 'News Clips', category: 'News Clips' },
    { src: '/assets/papercutting/2.jpg', alt: 'News Clips', category: 'News Clips' },
    { src: '/assets/papercutting/3.jpg', alt: 'News Clips', category: 'News Clips' },
    { src: '/assets/papercutting/4.jpg', alt: 'News Clips', category: 'News Clips' },
    { src: '/assets/papercutting/5.jpg', alt: 'News Clips', category: 'News Clips' },
    { src: '/assets/papercutting/6.jpg', alt: 'News Clips', category: 'News Clips' },
    { src: '/assets/papercutting/7.jpg', alt: 'News Clips', category: 'News Clips' },
    { src: '/assets/papercutting/8.jpg', alt: 'News Clips', category: 'News Clips' },
    { src: '/assets/papercutting/9.jpg', alt: 'News Clips', category: 'News Clips' },
    { src: '/assets/papercutting/10.jpg', alt: 'News Clips', category: 'News Clips' },
    { src: '/assets/papercutting/11.jpg', alt: 'News Clips', category: 'News Clips' },
    { src: '/assets/papercutting/12.jpg', alt: 'News Clips', category: 'News Clips' },
    { src: '/assets/papercutting/13.jpg', alt: 'News Clips', category: 'News Clips' },
    

    // Add more images here with their respective categories
  ];
  
  
 
  filteredImages: any[] = [];

  constructor() {
    
    this.filteredImages = this.images;
  
}

  filterImages(category: string): void {
    if (category === 'all') {
      this.filteredImages = this.images;
    } else {
      this.filteredImages = this.images.filter(image => image.category.includes(category));
    }
  }
}
