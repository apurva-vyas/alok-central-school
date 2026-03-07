import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SCHOOL_INFO } from '../shared/school-info';
import { YouTubeService, YouTubeVideo } from '../shared/youtube.service';
import { IMAGES } from '../shared/image-registry';

@Component({
  selector: 'app-video-gallery',
  templateUrl: './video-gallery.component.html',
  styleUrls: ['./video-gallery.component.css']
})
export class VideoGalleryComponent implements OnInit {
  heroImage = IMAGES.campus.galleryHero;
  channelUrl = SCHOOL_INFO.social.youtube;

  videos: YouTubeVideo[] = [];
  loading = true;
  error = '';

  activeVideo: YouTubeVideo | null = null;
  activeUrl: SafeResourceUrl | null = null;

  pageSize = 6;
  currentPage = 1;

  constructor(
    private sanitizer: DomSanitizer,
    private youtubeService: YouTubeService
  ) {}

  ngOnInit(): void {
    this.youtubeService.getVideos(50).subscribe({
      next: (videos) => {
        this.videos = videos;
        if (videos.length > 0) {
          this.setActiveVideo(videos[0]);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load videos:', err);
        this.error = 'Unable to load videos. Please visit our YouTube channel directly.';
        this.loading = false;
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.videos.length / this.pageSize);
  }

  get paginatedVideos(): YouTubeVideo[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.videos.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getEmbedUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    );
  }

  setActiveVideo(video: YouTubeVideo): void {
    this.activeVideo = video;
    this.activeUrl = this.getEmbedUrl(video.id);
  }

  playVideo(video: YouTubeVideo): void {
    this.setActiveVideo(video);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
