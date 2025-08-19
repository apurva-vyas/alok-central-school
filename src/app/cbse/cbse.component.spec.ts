import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBSE } from './cbse.component';

describe('CBSE', () => {
  let component: CBSE;
  let fixture: ComponentFixture<CBSE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CBSE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CBSE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
