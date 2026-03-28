import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FacultyMemberDTO {
  id: string;
  name: string;
  designation: string;
  gender?: string;
  department?: string | null;
  qualification?: string | null;
  experience?: string | null;
  email?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
  isActive?: boolean;
  displayOrder?: number;
}

export interface FacultyGroup {
  designation: string;
  members: FacultyMemberDTO[];
}

@Injectable({ providedIn: 'root' })
export class FacultyApiService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  list(): Observable<FacultyGroup[]> {
    return this.http.get<FacultyGroup[]>(`${this.api}/faculty`);
  }

  getById(id: string): Observable<FacultyMemberDTO> {
    return this.http.get<FacultyMemberDTO>(`${this.api}/faculty/${id}`);
  }

  adminList(): Observable<FacultyMemberDTO[]> {
    return this.http.get<FacultyMemberDTO[]>(`${this.api}/admin/faculty`);
  }

  create(data: FormData): Observable<FacultyMemberDTO> {
    return this.http.post<FacultyMemberDTO>(`${this.api}/faculty`, data);
  }

  update(id: string, data: FormData): Observable<FacultyMemberDTO> {
    return this.http.put<FacultyMemberDTO>(`${this.api}/faculty/${id}`, data);
  }

  toggle(id: string): Observable<{ isActive: boolean }> {
    return this.http.patch<{ isActive: boolean }>(`${this.api}/faculty/${id}/toggle`, {});
  }

  reorder(id: string, displayOrder: number): Observable<void> {
    return this.http.patch<void>(`${this.api}/faculty/${id}/order`, { displayOrder });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/faculty/${id}`);
  }
}
