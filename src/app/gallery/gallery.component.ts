import { Component, HostListener } from '@angular/core';

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  activeFilter = 'all';
  pageSize = 12;
  currentPage = 1;

  lightboxOpen = false;
  lightboxIndex = 0;
  zoomLevel = 1;
  isDragging = false;
  dragX = 0;
  dragY = 0;
  private startX = 0;
  private startY = 0;

  images: GalleryImage[] = [
    { src: '/assets/sciencefair/1.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/schooltour/1.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/2.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/3.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/4.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/5.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/6.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/7.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/8.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/9.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/10.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/11.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/12.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/13.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/schooltour/14.jpg', alt: 'School Trip', category: 'school trip' },
    { src: '/assets/sciencefair/2.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/sciencefair/3.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/sciencefair/4.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/sciencefair/5.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/sciencefair/6.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/sciencefair/7.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/sciencefair/8.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/sciencefair/9.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/sciencefair/10.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/sciencefair/11.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/sciencefair/12.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/sciencefair/13.jpg', alt: 'Science Fair', category: 'science fair' },
    { src: '/assets/sciencefair/14.jpg', alt: 'Science Fair', category: 'science fair' },
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
    { src: '/assets/ann/1.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/2.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/3.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/4.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/5.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/6.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/7.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/8.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/9.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/10.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/11.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/12.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/13.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/14.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/15.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/16.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/17.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/18.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/19.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/20.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/21.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/22.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/23.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/24.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/25.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/26.jpg', alt: 'Annual Function', category: 'Annual Function' },
    { src: '/assets/ann/27.jpg', alt: 'Annual Function', category: 'Annual Function' },
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
  ];

  filteredImages: GalleryImage[] = [];

  constructor() {
    this.filteredImages = this.images;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredImages.length / this.pageSize);
  }

  get paginatedImages(): GalleryImage[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredImages.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  filterImages(category: string): void {
    this.currentPage = 1;
    if (category === 'all') {
      this.filteredImages = this.images;
    } else {
      this.filteredImages = this.images.filter(img => img.category === category);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }

  openLightbox(index: number): void {
    const globalIndex = (this.currentPage - 1) * this.pageSize + index;
    this.lightboxIndex = globalIndex;
    this.lightboxOpen = true;
    this.resetZoom();
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    this.resetZoom();
    document.body.style.overflow = '';
  }

  get lightboxImage(): GalleryImage {
    return this.filteredImages[this.lightboxIndex];
  }

  lightboxPrev(event: Event): void {
    event.stopPropagation();
    this.resetZoom();
    this.lightboxIndex = this.lightboxIndex > 0
      ? this.lightboxIndex - 1
      : this.filteredImages.length - 1;
  }

  lightboxNext(event: Event): void {
    event.stopPropagation();
    this.resetZoom();
    this.lightboxIndex = this.lightboxIndex < this.filteredImages.length - 1
      ? this.lightboxIndex + 1
      : 0;
  }

  zoomIn(event: Event): void {
    event.stopPropagation();
    if (this.zoomLevel < 3) this.zoomLevel += 0.5;
  }

  zoomOut(event: Event): void {
    event.stopPropagation();
    if (this.zoomLevel > 1) {
      this.zoomLevel -= 0.5;
      if (this.zoomLevel === 1) { this.dragX = 0; this.dragY = 0; }
    }
  }

  resetZoom(): void {
    this.zoomLevel = 1;
    this.dragX = 0;
    this.dragY = 0;
  }

  onDragStart(event: MouseEvent): void {
    if (this.zoomLevel <= 1) return;
    event.preventDefault();
    this.isDragging = true;
    this.startX = event.clientX - this.dragX;
    this.startY = event.clientY - this.dragY;
  }

  onDragMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.dragX = event.clientX - this.startX;
    this.dragY = event.clientY - this.startY;
  }

  onDragEnd(): void {
    this.isDragging = false;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.lightboxOpen) return;
    switch (event.key) {
      case 'Escape': this.closeLightbox(); break;
      case 'ArrowLeft': this.lightboxPrev(event); break;
      case 'ArrowRight': this.lightboxNext(event); break;
      case '+': case '=': this.zoomIn(event); break;
      case '-': this.zoomOut(event); break;
    }
  }
}
