import { Component, OnInit } from '@angular/core';
import {
  ResultsApiService,
  StudentResultDTO,
  PaginatedResults,
} from '../shared/results-api.service';

@Component({
  selector: 'app-board-results',
  templateUrl: './board-results.component.html',
  styleUrls: ['./board-results.component.css'],
})
export class BoardResultsComponent implements OnInit {
  years: number[] = [];
  selectedYear = 0;
  selectedBoard = 'RBSE';
  results: StudentResultDTO[] = [];
  total = 0;
  currentPage = 1;
  totalPages = 0;
  loading = true;

  selectedStudent: StudentResultDTO | null = null;

  /** Max percentage on the currently loaded page (used for topper badge). */
  maxPercentageOnPage = 0;

  constructor(private resultsApi: ResultsApiService) {}

  ngOnInit(): void {
    this.resultsApi.getYears().subscribe({
      next: (y) => {
        this.years = [...(y ?? [])].sort((a, b) => b - a);
        this.selectedYear = this.years[0] ?? new Date().getFullYear();
        this.loadResults();
      },
      error: () => {
        this.years = [];
        this.selectedYear = new Date().getFullYear();
        this.loadResults();
      },
    });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  selectYear(year: number): void {
    if (year === this.selectedYear) return;
    this.selectedYear = year;
    this.currentPage = 1;
    this.loadResults();
  }

  selectBoard(board: string): void {
    if (board === this.selectedBoard) return;
    this.selectedBoard = board;
    this.currentPage = 1;
    this.loadResults();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.loadResults();
  }

  openDetail(student: StudentResultDTO): void {
    this.selectedStudent = student;
    document.body.style.overflow = 'hidden';
  }

  closeDetail(): void {
    this.selectedStudent = null;
    document.body.style.overflow = '';
  }

  loadResults(): void {
    this.loading = true;
    this.resultsApi
      .list(this.selectedYear, this.selectedBoard, this.currentPage)
      .subscribe({
        next: (res: PaginatedResults) => {
          this.results = res.data ?? [];
          this.total = res.total ?? 0;
          this.currentPage = res.page ?? this.currentPage;
          this.totalPages = res.totalPages ?? 0;
          this.maxPercentageOnPage = this.results.length
            ? Math.max(...this.results.map((r) => r.percentage))
            : 0;
          this.loading = false;
        },
        error: () => {
          this.results = [];
          this.total = 0;
          this.totalPages = 0;
          this.maxPercentageOnPage = 0;
          this.loading = false;
        },
      });
  }

  failedImages = new Set<string>();

  isSchoolTopper(student: StudentResultDTO): boolean {
    return student.percentage === this.maxPercentageOnPage && this.maxPercentageOnPage > 0;
  }

  onImgError(id: string): void {
    this.failedImages.add(id);
  }

  showPhoto(id: string, photoUrl?: string | null): boolean {
    return !!photoUrl && !this.failedImages.has(id);
  }
}
