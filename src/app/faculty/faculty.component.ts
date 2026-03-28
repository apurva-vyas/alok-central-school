import { Component, OnInit } from '@angular/core';
import { FacultyApiService, FacultyGroup, FacultyMemberDTO } from '../shared/faculty-api.service';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css'],
})
export class FacultyComponent implements OnInit {
  loading = true;
  failedImages = new Set<string>();

  pageSize = 12;
  currentPage = 1;

  /** Director, Principal, Vice Principal shown as featured cards */
  featuredMembers: FacultyMemberDTO[] = [];

  /** Everyone else in a single flat list */
  allStaff: FacultyMemberDTO[] = [];

  private readonly featuredDesignations = ['Director', 'Principal', 'Vice Principal'];

  constructor(private facultyApi: FacultyApiService) {}

  ngOnInit(): void {
    this.facultyApi.list().subscribe({
      next: (groups) => {
        const allGroups = groups ?? [];
        this.featuredMembers = allGroups
          .filter(g => this.featuredDesignations.includes(g.designation))
          .reduce((acc, g) => [...acc, ...g.members.map(m => ({ ...m, designation: g.designation }))], [] as FacultyMemberDTO[]);

        this.allStaff = allGroups
          .filter(g => !this.featuredDesignations.includes(g.designation))
          .reduce((acc, g) => [...acc, ...g.members.map(m => ({ ...m, designation: g.designation }))], [] as FacultyMemberDTO[]);

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.allStaff.length / this.pageSize);
  }

  get paginatedStaff(): FacultyMemberDTO[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allStaff.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }

  onImgError(id: string): void {
    this.failedImages.add(id);
  }

  showPhoto(id: string, photoUrl?: string | null): boolean {
    return !!photoUrl && !this.failedImages.has(id);
  }
}
