import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GalleryImageDTO {
  id: string;
  title: string;
  category: string;
  alt: string | null;
  s3Url: string;
  date: string;
  isActive?: boolean;
  displayOrder?: number;
}

@Injectable({ providedIn: 'root' })
export class GalleryApiService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.api}/gallery/categories`);
  }

  list(category?: string): Observable<GalleryImageDTO[]> {
    const params = category && category !== 'all' ? `?category=${category}` : '';
    return this.http.get<GalleryImageDTO[]>(`${this.api}/gallery${params}`);
  }

  adminList(): Observable<GalleryImageDTO[]> {
    return this.http.get<GalleryImageDTO[]>(`${this.api}/admin/gallery`);
  }

  upload(file: File, title: string, category: string, date?: string, displayOrder?: number): Observable<GalleryImageDTO> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    fd.append('category', category);
    if (date) fd.append('date', date);
    if (displayOrder) fd.append('displayOrder', String(displayOrder));
    return this.http.post<GalleryImageDTO>(`${this.api}/upload`, fd);
  }

  update(id: string, data: Partial<GalleryImageDTO>): Observable<GalleryImageDTO> {
    return this.http.put<GalleryImageDTO>(`${this.api}/gallery/${id}`, data);
  }

  toggle(id: string): Observable<{ isActive: boolean }> {
    return this.http.patch<{ isActive: boolean }>(`${this.api}/gallery/${id}/toggle`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/gallery/${id}`);
  }
}
