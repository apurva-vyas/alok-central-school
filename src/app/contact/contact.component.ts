import { Component } from '@angular/core';
import { SCHOOL_INFO } from '../shared/school-info';
import { IMAGES } from '../shared/image-registry';
import { ContactApiService } from '../shared/contact-api.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  heroImage = IMAGES.campus.cbseHero;
  school = SCHOOL_INFO;

  form = { name: '', email: '', mobile: '', message: '' };
  submitting = false;
  submitted = false;
  errorMessage = '';

  constructor(private contactApi: ContactApiService) {}

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.form.name.trim()) { this.errorMessage = 'Please enter your name.'; return; }
    if (!this.form.email.trim() || !this.isValidEmail(this.form.email)) { this.errorMessage = 'Please enter a valid email address.'; return; }
    if (!this.form.message.trim()) { this.errorMessage = 'Please enter your message.'; return; }

    this.submitting = true;
    this.contactApi.submit({
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      mobile: this.form.mobile.trim() || undefined,
      message: this.form.message.trim(),
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
        this.form = { name: '', email: '', mobile: '', message: '' };
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'Failed to send message. Please try again.';
      },
    });
  }

  resetForm(): void {
    this.submitted = false;
    this.errorMessage = '';
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}
