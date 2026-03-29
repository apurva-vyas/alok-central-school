import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gender-avatar',
  template: `
    <div class="avatar-wrap" [class.avatar--female]="isFemale" [style.width.px]="size" [style.height.px]="size">
      <svg *ngIf="!isFemale" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
        <circle cx="32" cy="20" r="12"/>
        <path d="M10 56c0-12.15 9.85-22 22-22s22 9.85 22 22v2H10v-2z"/>
      </svg>
      <svg *ngIf="isFemale" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
        <circle cx="32" cy="18" r="12"/>
        <path d="M22 14c-2-6 0-12 10-13s12 7 10 13"/>
        <path d="M10 56c0-12.15 9.85-22 22-22s22 9.85 22 22v2H10v-2z"/>
      </svg>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .avatar-wrap {
      border-radius: 50%;
      background: linear-gradient(135deg, #4A90D9 0%, #357ABD 100%);
      color: rgba(255, 255, 255, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 3px solid #4A90D9;
      box-sizing: border-box;
      max-width: 100%;
      max-height: 100%;
      aspect-ratio: 1;
    }
    .avatar-wrap svg {
      width: 58%;
      height: 58%;
      margin-top: 8%;
    }
    .avatar--female {
      background: linear-gradient(135deg, #E91E8C 0%, #C2185B 100%);
      border-color: #E91E8C;
    }
  `],
})
export class GenderAvatarComponent {
  @Input() gender: string = 'Male';
  @Input() size: number = 120;

  get isFemale(): boolean {
    return (this.gender || '').toLowerCase() === 'female';
  }
}
