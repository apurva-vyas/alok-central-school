import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CBSEComponent } from './cbse.component';

describe('CBSEComponent', () => {
  let component: CBSEComponent;
  let fixture: ComponentFixture<CBSEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CBSEComponent],
      imports: [HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(CBSEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
