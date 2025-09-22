import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsOptionsComponent } from './doctors-options.component';

describe('DoctorsOptionsComponent', () => {
  let component: DoctorsOptionsComponent;
  let fixture: ComponentFixture<DoctorsOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
