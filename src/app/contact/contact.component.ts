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
  selectedCountryCode = '+91';
  submitting = false;
  submitted = false;
  errorMessage = '';

  countryCodes = [
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+1', flag: '🇺🇸', name: 'USA' },
    { code: '+44', flag: '🇬🇧', name: 'UK' },
    { code: '+971', flag: '🇦🇪', name: 'UAE' },
    { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: '+974', flag: '🇶🇦', name: 'Qatar' },
    { code: '+968', flag: '🇴🇲', name: 'Oman' },
    { code: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+977', flag: '🇳🇵', name: 'Nepal' },
    { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
    { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
    { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
  ];

  constructor(private contactApi: ContactApiService) {}

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.form.name.trim()) { this.errorMessage = 'Please enter your name.'; return; }
    if (!this.form.mobile.trim()) { this.errorMessage = 'Please enter your mobile number.'; return; }
    if (this.form.email.trim() && !this.isValidEmail(this.form.email)) { this.errorMessage = 'Please enter a valid email address.'; return; }
    if (!this.form.message.trim()) { this.errorMessage = 'Please enter your message.'; return; }

    this.submitting = true;
    this.contactApi.submit({
      name: this.form.name.trim(),
      email: this.form.email.trim() || '',
      mobile: `${this.selectedCountryCode} ${this.form.mobile.trim()}`,
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
