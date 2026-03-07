import { Component, HostListener } from '@angular/core';
import { IMAGES, GALLERY_IMAGES, GalleryImage } from '../shared/image-registry';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  galleryHero = IMAGES.campus.galleryHero;
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

  images: GalleryImage[] = GALLERY_IMAGES;

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
