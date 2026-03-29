import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StudentResultDTO {
  id: string;
  name: string;
  fatherName: string;
  gender: string;
  percentage: number;
  board: string;
  year: number;
  rollNumber?: string | null;
  dob?: string | null;
  admissionNo?: string | null;
  contactNumber?: string | null;
  photoUrl?: string | null;
  className: string;
  isActive?: boolean;
}

export interface PaginatedResults {
  data: StudentResultDTO[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class ResultsApiService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getYears(): Observable<number[]> {
    return this.http.get<number[]>(`${this.api}/results/years`);
  }

  list(year: number, board: string, page = 1, limit = 10): Observable<PaginatedResults> {
    return this.http.get<PaginatedResults>(
      `${this.api}/results?year=${year}&board=${board}&page=${page}&limit=${limit}`
    );
  }

  adminList(params: { year?: number; board?: string; search?: string; page?: number }): Observable<PaginatedResults> {
    const q = new URLSearchParams();
    if (params.year) q.set('year', params.year.toString());
    if (params.board) q.set('board', params.board);
    if (params.search) q.set('search', params.search);
    if (params.page) q.set('page', params.page.toString());
    return this.http.get<PaginatedResults>(`${this.api}/admin/results?${q.toString()}`);
  }

  create(data: FormData): Observable<StudentResultDTO> {
    return this.http.post<StudentResultDTO>(`${this.api}/results`, data);
  }

  update(id: string, data: FormData): Observable<StudentResultDTO> {
    return this.http.put<StudentResultDTO>(`${this.api}/results/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/results/${id}`);
  }
}
