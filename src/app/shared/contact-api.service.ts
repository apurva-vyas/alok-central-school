import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactMessageDTO {
  id: string;
  name: string;
  email: string;
  mobile?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedMessages {
  data: ContactMessageDTO[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  submit(data: { name: string; email: string; mobile?: string; message: string }): Observable<{ success: boolean; id: string }> {
    return this.http.post<{ success: boolean; id: string }>(`${this.api}/contact`, data);
  }

  adminList(page = 1): Observable<PaginatedMessages> {
    return this.http.get<PaginatedMessages>(`${this.api}/admin/messages?page=${page}`);
  }

  markRead(id: string): Observable<{ isRead: boolean }> {
    return this.http.patch<{ isRead: boolean }>(`${this.api}/admin/messages/${id}/read`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/admin/messages/${id}`);
  }
}
