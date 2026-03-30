import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { GalleryApiService, GalleryImageDTO } from '../shared/gallery-api.service';
import { FacultyApiService, FacultyMemberDTO } from '../shared/faculty-api.service';
import {
  ResultsApiService,
  StudentResultDTO,
  PaginatedResults,
} from '../shared/results-api.service';
import {
  ContactApiService,
  ContactMessageDTO,
  PaginatedMessages,
} from '../shared/contact-api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  activeTab: 'gallery' | 'faculty' | 'results' | 'messages' = 'gallery';

  galleryImages: GalleryImageDTO[] = [];
  gallerySearch = '';
  galleryCategory = 'all';
  galleryVisibility: 'all' | 'active' | 'hidden' = 'all';
  galleryPage = 1;
  readonly galleryPageSize = 12;

  facultyList: FacultyMemberDTO[] = [];
  facultySearch = '';
  facultyDesignation = 'all';
  facultyPage = 1;
  readonly facultyPageSize = 12;

  resultsList: StudentResultDTO[] = [];
  resultsYear: number | null = null;
  resultsBoard = '';
  resultsSearch = '';
  resultsPage = 1;
  resultsTotalPages = 1;
  resultsTotal = 0;
  readonly resultsPageSize = 20;

  resultYearsOptions: number[] = [];

  messagesList: ContactMessageDTO[] = [];
  messagesPage = 1;
  messagesTotalPages = 1;
  messagesTotal = 0;
  selectedMessage: ContactMessageDTO | null = null;

  uploadFiles: File[] = [];
  uploadTitle = '';
  uploadCategory = 'Events';
  uploadDisplayOrder: number | null = null;
  uploading = false;
  uploadProgress = 0;
  uploadTotal = 0;

  facultyFormVisible = false;
  editingFaculty: FacultyMemberDTO | null = null;
  facultyForm = {
    name: '',
    designation: 'Teacher',
    gender: 'Male',
    department: '',
    qualification: '',
    experience: '',
    email: '',
    phone: '',
    displayOrder: null as number | null,
  };
  facultyPhotoFile: File | null = null;

  resultsFormVisible = false;
  editingResult: StudentResultDTO | null = null;
  resultForm = {
    year: new Date().getFullYear(),
    board: 'CBSE',
    name: '',
    fatherName: '',
    gender: 'Male',
    percentage: 0,
    rollNumber: '',
    dob: '',
    admissionNo: '',
    contactNumber: '',
  };
  resultPhotoFile: File | null = null;

  galleryEditVisible = false;
  editingGallery: GalleryImageDTO | null = null;
  galleryEditForm = { title: '', category: '', alt: '', displayOrder: null as number | null };

  /** Merged from existing gallery + DB. Populated in ngOnInit. */
  galleryCategories: string[] = [];

  /** Default categories matching the existing static gallery */
  private readonly defaultCategories = [
    'Science Fair',
    'School Trip',
    'Janmashtami',
    'Annual Function',
    'News Clips',
    'Sports',
    'Events',
    'Campus',
    'Celebration',
    'Infrastructure',
  ];

  showNewCategoryInput = false;
  newCategoryName = '';

  readonly designationOptions = [
    'Director',
    'Principal',
    'Vice Principal',
    'Head Teacher',
    'Teacher',
    'PET',
    'Librarian',
    'Other',
  ];

  showCustomDesignation = false;
  customDesignation = '';

  errorMessage = '';
  formError = '';
  successMessage = '';

  failedImages = new Set<string>();

  confirmVisible = false;
  confirmTitle = '';
  confirmMessage = '';
  private confirmCallback: (() => void) | null = null;

  readonly emptyThumbDataUri =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect fill="#E4D8CC" width="60" height="60"/></svg>'
    );

  readonly maleAvatarDataUri =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect fill="#4A90D9" width="60" height="60" rx="30"/><circle cx="30" cy="22" r="10" fill="rgba(255,255,255,0.85)"/><path d="M10 52c0-11 8.95-20 20-20s20 9 20 20v2H10v-2z" fill="rgba(255,255,255,0.85)"/></svg>'
    );

  readonly femaleAvatarDataUri =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect fill="#E91E8C" width="60" height="60" rx="30"/><circle cx="30" cy="20" r="10" fill="rgba(255,255,255,0.85)"/><path d="M22 16c-2-5 0-10 8-11s10 6 8 11" fill="rgba(255,255,255,0.85)"/><path d="M10 52c0-11 8.95-20 20-20s20 9 20 20v2H10v-2z" fill="rgba(255,255,255,0.85)"/></svg>'
    );

  getAvatarUri(gender?: string): string {
    return (gender || '').toLowerCase() === 'female' ? this.femaleAvatarDataUri : this.maleAvatarDataUri;
  }

  showConfirm(title: string, message: string, onConfirm: () => void): void {
    this.confirmTitle = title;
    this.confirmMessage = message;
    this.confirmCallback = onConfirm;
    this.confirmVisible = true;
  }

  onConfirmYes(): void {
    if (this.confirmCallback) this.confirmCallback();
    this.confirmVisible = false;
    this.confirmCallback = null;
  }

  onConfirmCancel(): void {
    this.confirmVisible = false;
    this.confirmCallback = null;
  }

  onImgError(id: string): void {
    this.failedImages.add(id);
  }

  showPhoto(id: string, photoUrl?: string | null): boolean {
    return !!photoUrl && !this.failedImages.has(id);
  }

  constructor(
    public authService: AuthService,
    private router: Router,
    private galleryApi: GalleryApiService,
    private facultyApi: FacultyApiService,
    private resultsApi: ResultsApiService,
    private contactApi: ContactApiService
  ) {}

  ngOnInit(): void {
    this.loadGallery();
    this.loadCategories();
  }

  private loadResultYears(): void {
    if (this.resultYearsOptions.length > 0) return;
    this.resultsApi.getYears().subscribe({
      next: years => {
        this.resultYearsOptions = years;
        if (this.resultsYear === null && years.length) {
          this.resultsYear = years[0];
        }
      },
      error: () => {
        this.resultYearsOptions = [new Date().getFullYear()];
      },
    });
  }

  loadCategories(): void {
    this.galleryApi.getCategories().subscribe({
      next: dbCategories => {
        const merged = new Set([...this.defaultCategories, ...dbCategories]);
        this.galleryCategories = Array.from(merged).sort();
        if (!this.galleryCategories.includes(this.uploadCategory)) {
          this.uploadCategory = this.galleryCategories[0] || 'Events';
        }
      },
      error: () => {
        this.galleryCategories = [...this.defaultCategories];
      },
    });
  }

  addNewCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;
    if (!this.galleryCategories.includes(name)) {
      this.galleryCategories = [...this.galleryCategories, name].sort();
    }
    this.uploadCategory = name;
    this.newCategoryName = '';
    this.showNewCategoryInput = false;
  }

  toggleNewCategoryInput(): void {
    this.showNewCategoryInput = !this.showNewCategoryInput;
    this.newCategoryName = '';
  }

  switchTab(tab: 'gallery' | 'faculty' | 'results' | 'messages'): void {
    this.activeTab = tab;
    this.clearMessages();
    if (tab === 'gallery') {
      this.loadGallery();
    } else if (tab === 'faculty') {
      this.loadFaculty();
    } else if (tab === 'results') {
      this.loadResultYears();
      this.loadResults();
    } else if (tab === 'messages') {
      this.loadMessages();
    }
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/']);
  }

  get allFilteredGalleryImages(): GalleryImageDTO[] {
    let list = [...this.galleryImages];
    const q = this.gallerySearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        i =>
          i.title.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    if (this.galleryCategory && this.galleryCategory !== 'all') {
      list = list.filter(i => i.category === this.galleryCategory);
    }
    if (this.galleryVisibility === 'active') {
      list = list.filter(i => i.isActive !== false);
    } else if (this.galleryVisibility === 'hidden') {
      list = list.filter(i => i.isActive === false);
    }
    return list;
  }

  get filteredGalleryImages(): GalleryImageDTO[] {
    const all = this.allFilteredGalleryImages;
    const start = (this.galleryPage - 1) * this.galleryPageSize;
    return all.slice(start, start + this.galleryPageSize);
  }

  get galleryTotalPages(): number {
    return Math.ceil(this.allFilteredGalleryImages.length / this.galleryPageSize);
  }

  get galleryTotal(): number {
    return this.allFilteredGalleryImages.length;
  }

  get visibleGalleryPages(): number[] {
    const t = this.galleryTotalPages;
    if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
    const cur = this.galleryPage;
    let start = Math.max(1, cur - 2);
    let end = Math.min(t, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  goGalleryPage(page: number): void {
    if (page < 1 || page > this.galleryTotalPages) return;
    this.galleryPage = page;
  }

  onGalleryFilterChange(): void {
    this.galleryPage = 1;
  }

  get visibleResultPages(): number[] {
    const t = this.resultsTotalPages;
    if (t <= 0) return [];
    if (t <= 9) {
      return Array.from({ length: t }, (_, i) => i + 1);
    }
    const cur = this.resultsPage;
    let end = Math.min(t, Math.max(cur + 2, 5));
    let start = Math.max(1, end - 4);
    end = Math.min(t, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  get allFilteredFacultyList(): FacultyMemberDTO[] {
    let list = [...this.facultyList];
    const q = this.facultySearch.trim().toLowerCase();
    if (q) {
      list = list.filter(f => f.name.toLowerCase().includes(q));
    }
    if (this.facultyDesignation && this.facultyDesignation !== 'all') {
      list = list.filter(f => f.designation === this.facultyDesignation);
    }
    return list;
  }

  get filteredFacultyList(): FacultyMemberDTO[] {
    const all = this.allFilteredFacultyList;
    const start = (this.facultyPage - 1) * this.facultyPageSize;
    return all.slice(start, start + this.facultyPageSize);
  }

  get facultyTotalPages(): number {
    return Math.ceil(this.allFilteredFacultyList.length / this.facultyPageSize);
  }

  get facultyTotal(): number {
    return this.allFilteredFacultyList.length;
  }

  get visibleFacultyPages(): number[] {
    const t = this.facultyTotalPages;
    if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
    const cur = this.facultyPage;
    let start = Math.max(1, cur - 2);
    let end = Math.min(t, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  goFacultyPage(page: number): void {
    if (page < 1 || page > this.facultyTotalPages) return;
    this.facultyPage = page;
  }

  onFacultyFilterChange(): void {
    this.facultyPage = 1;
  }

  isGalleryItemHidden(item: GalleryImageDTO): boolean {
    return item.isActive === false;
  }

  onUploadFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.uploadFiles = input.files ? Array.from(input.files) : [];
  }

  onFacultyPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.facultyPhotoFile = input.files?.[0] ?? null;
  }

  onResultPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.resultPhotoFile = input.files?.[0] ?? null;
  }

  loadGallery(): void {
    this.clearMessages();
    this.galleryApi.adminList().subscribe({
      next: data => {
        this.galleryImages = data;
        this.loadCategories();
      },
      error: (err) => {
        this.errorMessage = this.extractError(err, 'Could not load gallery.');
      },
    });
  }

  loadFaculty(): void {
    this.clearMessages();
    this.facultyApi.adminList().subscribe({
      next: data => {
        this.facultyList = data;
      },
      error: (err) => {
        this.errorMessage = this.extractError(err, 'Could not load faculty.');
      },
    });
  }

  loadResults(): void {
    this.clearMessages();
    this.resultsApi
      .adminList({
        year: this.resultsYear ?? undefined,
        board: this.resultsBoard || undefined,
        search: this.resultsSearch.trim() || undefined,
        page: this.resultsPage,
      })
      .subscribe({
        next: (res: PaginatedResults) => {
          this.resultsList = res.data;
          this.resultsTotalPages = Math.max(1, res.totalPages);
          this.resultsTotal = res.total;
        },
        error: (err) => {
          this.errorMessage = this.extractError(err, 'Could not load results.');
        },
      });
  }

  applyResultsFilters(): void {
    this.resultsPage = 1;
    this.loadResults();
  }

  goResultsPage(page: number): void {
    if (page < 1 || page > this.resultsTotalPages) return;
    this.resultsPage = page;
    this.loadResults();
  }

  private titleFromFilename(filename: string): string {
    return filename
      .replace(/\.[^/.]+$/, '')
      .replace(/[_\-]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .trim() || 'Untitled';
  }

  uploadImage(): void {
    if (this.uploadFiles.length === 0) {
      this.errorMessage = 'Choose at least one file to upload.';
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.uploadTotal = this.uploadFiles.length;
    this.clearMessages();

    const category = this.uploadCategory;
    const customTitle = this.uploadTitle.trim();
    const displayOrder = this.uploadDisplayOrder ?? undefined;
    let completed = 0;
    let failed = 0;

    const uploadNext = (index: number) => {
      if (index >= this.uploadFiles.length) {
        this.uploading = false;
        this.uploadFiles = [];
        this.uploadTitle = '';
        this.uploadDisplayOrder = null;
        if (failed > 0) {
          this.errorMessage = `${failed} of ${this.uploadTotal} uploads failed.`;
        }
        if (completed > 0) {
          this.showSuccess(`${completed} image${completed > 1 ? 's' : ''} uploaded successfully!`);
        }
        this.loadGallery();
        return;
      }

      const file = this.uploadFiles[index];
      const title = this.uploadTotal === 1 && customTitle
        ? customTitle
        : this.titleFromFilename(file.name);

      this.galleryApi.upload(file, title, category, undefined, displayOrder).subscribe({
        next: () => {
          completed++;
          this.uploadProgress = completed + failed;
          uploadNext(index + 1);
        },
        error: () => {
          failed++;
          this.uploadProgress = completed + failed;
          uploadNext(index + 1);
        },
      });
    };

    uploadNext(0);
  }

  openGalleryEdit(item: GalleryImageDTO): void {
    this.editingGallery = item;
    if (item.category && !this.galleryCategories.includes(item.category)) {
      this.galleryCategories = [...this.galleryCategories, item.category].sort();
    }
    this.galleryEditForm = {
      title: item.title,
      category: item.category,
      alt: item.alt ?? '',
      displayOrder: item.displayOrder || null,
    };
    this.galleryEditVisible = true;
  }

  cancelGalleryEdit(): void {
    this.galleryEditVisible = false;
    this.editingGallery = null;
  }

  /** Persists gallery metadata from the edit overlay (wired to Edit on each row). */
  saveGalleryEdit(): void {
    if (!this.editingGallery) return;
    const { title, category, alt } = this.galleryEditForm;
    if (!title.trim()) {
      this.formError = 'Title is required.';
      return;
    }
    this.formError = '';
    this.clearMessages();
    const { displayOrder } = this.galleryEditForm;
    this.galleryApi
      .update(this.editingGallery.id, {
        title: title.trim(),
        category,
        alt: alt.trim() || null,
        displayOrder: displayOrder ?? 0,
      })
      .subscribe({
        next: updated => {
          const idx = this.galleryImages.findIndex(i => i.id === updated.id);
          if (idx >= 0) this.galleryImages[idx] = updated;
          this.cancelGalleryEdit();
          this.showSuccess('Gallery item updated.');
        },
        error: (err) => {
          this.formError = this.extractError(err, 'Could not update gallery item.');
        },
      });
  }

  toggleGalleryItem(item: GalleryImageDTO): void {
    this.clearMessages();
    this.galleryApi.toggle(item.id).subscribe({
      next: res => {
        item.isActive = res.isActive;
      },
      error: (err) => {
        this.errorMessage = this.extractError(err, 'Could not toggle visibility.');
      },
    });
  }

  deleteGalleryItem(item: GalleryImageDTO): void {
    this.showConfirm(
      'Delete Image',
      `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
      () => {
        this.clearMessages();
        this.galleryApi.delete(item.id).subscribe({
          next: () => {
            this.galleryImages = this.galleryImages.filter(i => i.id !== item.id);
            this.showSuccess('Image deleted.');
          },
          error: (err) => {
            this.errorMessage = this.extractError(err, 'Delete failed.');
          },
        });
      }
    );
  }

  showAddFaculty(): void {
    this.editingFaculty = null;
    this.facultyForm = {
      name: '',
      designation: 'Teacher',
      gender: 'Male',
      department: '',
      qualification: '',
      experience: '',
      email: '',
      phone: '',
      displayOrder: null,
    };
    this.facultyPhotoFile = null;
    this.formError = '';
    this.showCustomDesignation = false;
    this.customDesignation = '';
    this.facultyFormVisible = true;
  }

  openFacultyEdit(member: FacultyMemberDTO): void {
    this.editingFaculty = member;
    const isStandard = this.designationOptions.includes(member.designation);
    this.facultyForm = {
      name: member.name,
      designation: isStandard ? member.designation : 'Other',
      gender: member.gender || 'Male',
      department: member.department ?? '',
      qualification: member.qualification ?? '',
      experience: member.experience ?? '',
      email: member.email ?? '',
      phone: member.phone ?? '',
      displayOrder: member.displayOrder || null,
    };
    this.showCustomDesignation = !isStandard;
    this.customDesignation = isStandard ? '' : member.designation;
    this.facultyPhotoFile = null;
    this.formError = '';
    this.facultyFormVisible = true;
  }

  cancelFacultyForm(): void {
    this.facultyFormVisible = false;
    this.editingFaculty = null;
    this.facultyPhotoFile = null;
  }

  onDesignationChange(): void {
    this.showCustomDesignation = this.facultyForm.designation === 'Other';
    if (!this.showCustomDesignation) this.customDesignation = '';
  }

  private buildFacultyFormData(): FormData {
    const fd = new FormData();
    fd.append('name', this.facultyForm.name.trim());
    const designation = this.facultyForm.designation === 'Other' && this.customDesignation.trim()
      ? this.customDesignation.trim()
      : this.facultyForm.designation;
    fd.append('designation', designation);
    fd.append('gender', this.facultyForm.gender);
    if (this.facultyForm.department.trim()) {
      fd.append('department', this.facultyForm.department.trim());
    }
    if (this.facultyForm.qualification.trim()) {
      fd.append('qualification', this.facultyForm.qualification.trim());
    }
    if (this.facultyForm.experience.trim()) {
      fd.append('experience', this.facultyForm.experience.trim());
    }
    if (this.facultyForm.email.trim()) {
      fd.append('email', this.facultyForm.email.trim());
    }
    if (this.facultyForm.phone.trim()) {
      fd.append('phone', this.facultyForm.phone.trim());
    }
    if (this.facultyForm.displayOrder) {
      fd.append('displayOrder', String(this.facultyForm.displayOrder));
    } else {
      fd.append('displayOrder', '0');
    }
    if (this.facultyPhotoFile) {
      fd.append('file', this.facultyPhotoFile, this.facultyPhotoFile.name);
    }
    return fd;
  }

  saveFaculty(): void {
    this.formError = '';
    if (!this.facultyForm.name.trim()) {
      this.formError = 'Name is required.';
      return;
    }
    if (!this.facultyForm.designation) {
      this.formError = 'Designation is required.';
      return;
    }
    const fd = this.buildFacultyFormData();
    if (this.editingFaculty) {
      this.facultyApi.update(this.editingFaculty.id, fd).subscribe({
        next: updated => {
          const idx = this.facultyList.findIndex(f => f.id === updated.id);
          if (idx >= 0) this.facultyList[idx] = updated;
          this.cancelFacultyForm();
          this.showSuccess('Faculty member updated.');
        },
        error: (err) => {
          this.formError = this.extractError(err, 'Could not save faculty member.');
        },
      });
    } else {
      this.facultyApi.create(fd).subscribe({
        next: created => {
          this.facultyList = [...this.facultyList, created];
          this.cancelFacultyForm();
          this.showSuccess('Faculty member added.');
        },
        error: (err) => {
          this.formError = this.extractError(err, 'Could not create faculty member.');
        },
      });
    }
  }

  toggleFaculty(member: FacultyMemberDTO): void {
    this.clearMessages();
    this.facultyApi.toggle(member.id).subscribe({
      next: res => {
        member.isActive = res.isActive;
      },
      error: (err) => {
        this.errorMessage = this.extractError(err, 'Could not toggle faculty status.');
      },
    });
  }

  deleteFaculty(member: FacultyMemberDTO): void {
    this.showConfirm(
      'Delete Faculty Member',
      `Are you sure you want to delete "${member.name}"? This will permanently remove their profile and photo.`,
      () => {
        this.clearMessages();
        this.facultyApi.delete(member.id).subscribe({
          next: () => {
            this.facultyList = this.facultyList.filter(f => f.id !== member.id);
            this.showSuccess('Faculty member deleted.');
          },
          error: (err) => {
            this.errorMessage = this.extractError(err, 'Delete failed.');
          },
        });
      }
    );
  }

  showAddResult(): void {
    this.editingResult = null;
    this.resultForm = {
      year: this.resultsYear ?? new Date().getFullYear(),
      board: this.resultsBoard || 'CBSE',
      name: '',
      fatherName: '',
      gender: 'Male',
      percentage: 0,
      rollNumber: '',
      dob: '',
      admissionNo: '',
      contactNumber: '',
    };
    this.resultPhotoFile = null;
    this.formError = '';
    this.resultsFormVisible = true;
  }

  openResultEdit(row: StudentResultDTO): void {
    this.editingResult = row;
    this.resultForm = {
      year: row.year,
      board: row.board,
      name: row.name,
      fatherName: row.fatherName,
      gender: row.gender,
      percentage: row.percentage,
      rollNumber: row.rollNumber ?? '',
      dob: row.dob ? row.dob.slice(0, 10) : '',
      admissionNo: row.admissionNo ?? '',
      contactNumber: row.contactNumber ?? '',
    };
    this.resultPhotoFile = null;
    this.formError = '';
    this.resultsFormVisible = true;
  }

  cancelResultForm(): void {
    this.resultsFormVisible = false;
    this.editingResult = null;
    this.resultPhotoFile = null;
  }

  private buildResultFormData(): FormData {
    const fd = new FormData();
    fd.append('name', this.resultForm.name.trim());
    fd.append('fatherName', this.resultForm.fatherName.trim());
    fd.append('gender', this.resultForm.gender);
    fd.append('percentage', String(Number(this.resultForm.percentage)));
    fd.append('board', this.resultForm.board);
    fd.append('year', String(this.resultForm.year));
    if (this.resultForm.rollNumber.trim()) {
      fd.append('rollNumber', this.resultForm.rollNumber.trim());
    }
    if (this.resultForm.dob) {
      fd.append('dob', this.resultForm.dob);
    }
    if (this.resultForm.admissionNo.trim()) {
      fd.append('admissionNo', this.resultForm.admissionNo.trim());
    }
    if (this.resultForm.contactNumber.trim()) {
      fd.append('contactNumber', this.resultForm.contactNumber.trim());
    }
    if (this.resultPhotoFile) {
      fd.append('file', this.resultPhotoFile, this.resultPhotoFile.name);
    }
    return fd;
  }

  saveResult(): void {
    this.formError = '';
    if (!this.resultForm.name.trim() || !this.resultForm.fatherName.trim()) {
      this.formError = 'Name and father\'s name are required.';
      return;
    }
    const pct = Number(this.resultForm.percentage);
    if (Number.isNaN(pct)) {
      this.formError = 'Percentage is required.';
      return;
    }
    const fd = this.buildResultFormData();
    if (this.editingResult) {
      this.resultsApi.update(this.editingResult.id, fd).subscribe({
        next: updated => {
          const idx = this.resultsList.findIndex(r => r.id === updated.id);
          if (idx >= 0) this.resultsList[idx] = updated;
          this.cancelResultForm();
          this.showSuccess('Result updated.');
          this.loadResults();
        },
        error: (err) => {
          this.formError = this.extractError(err, 'Could not update result.');
        },
      });
    } else {
      this.resultsApi.create(fd).subscribe({
        next: () => {
          this.cancelResultForm();
          this.showSuccess('Student result added.');
          this.loadResults();
        },
        error: (err) => {
          this.formError = this.extractError(err, 'Could not create result.');
        },
      });
    }
  }

  deleteResult(row: StudentResultDTO): void {
    this.showConfirm(
      'Delete Student Result',
      `Are you sure you want to delete the result for "${row.name}" (${row.board} ${row.year}, ${row.percentage}%)? This action cannot be undone.`,
      () => {
        this.clearMessages();
        this.resultsApi.delete(row.id).subscribe({
          next: () => {
            this.resultsList = this.resultsList.filter(r => r.id !== row.id);
            this.showSuccess('Result deleted.');
            this.loadResults();
          },
          error: (err) => {
            this.errorMessage = this.extractError(err, 'Delete failed.');
          },
        });
      }
    );
  }

  loadMessages(): void {
    this.clearMessages();
    this.contactApi.adminList(this.messagesPage).subscribe({
      next: (res: PaginatedMessages) => {
        this.messagesList = res.data;
        this.messagesTotalPages = Math.max(1, res.totalPages);
        this.messagesTotal = res.total;
      },
      error: (err) => {
        this.errorMessage = this.extractError(err, 'Could not load messages.');
      },
    });
  }

  goMessagesPage(page: number): void {
    if (page < 1 || page > this.messagesTotalPages) return;
    this.messagesPage = page;
    this.loadMessages();
  }

  get visibleMessagePages(): number[] {
    const t = this.messagesTotalPages;
    if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
    const cur = this.messagesPage;
    let start = Math.max(1, cur - 2);
    let end = Math.min(t, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  openMessage(msg: ContactMessageDTO): void {
    this.selectedMessage = msg;
    if (!msg.isRead) {
      this.contactApi.markRead(msg.id).subscribe({
        next: () => { msg.isRead = true; },
      });
    }
  }

  closeMessage(): void {
    this.selectedMessage = null;
  }

  deleteMessage(msg: ContactMessageDTO): void {
    this.showConfirm(
      'Delete Message',
      `Delete message from "${msg.name}"? This cannot be undone.`,
      () => {
        this.contactApi.delete(msg.id).subscribe({
          next: () => {
            this.messagesList = this.messagesList.filter(m => m.id !== msg.id);
            this.selectedMessage = null;
            this.showSuccess('Message deleted.');
            this.loadMessages();
          },
          error: (err) => {
            this.errorMessage = this.extractError(err, 'Delete failed.');
          },
        });
      }
    );
  }

  formatDate(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString();
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.formError = '';
    this.successMessage = '';
  }

  private extractError(err: unknown, fallback: string): string {
    if (err && typeof err === 'object') {
      const httpErr = err as { error?: unknown; message?: string; status?: number };
      if (httpErr.error && typeof httpErr.error === 'object') {
        const body = httpErr.error as { error?: string; message?: string };
        if (body.error) return body.error;
        if (body.message) return body.message;
      }
      if (typeof httpErr.error === 'string') return httpErr.error;
      if (httpErr.message) return httpErr.message;
      if (httpErr.status === 0) return 'Server is not reachable. Make sure the backend is running.';
      if (httpErr.status === 401) return 'Session expired. Please log in again.';
    }
    return fallback;
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => { this.successMessage = ''; }, 4000);
  }
}
