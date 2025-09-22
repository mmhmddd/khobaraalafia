import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicsOptionsComponent } from './clinics-options.component';

describe('ClinicsOptionsComponent', () => {
  let component: ClinicsOptionsComponent;
  let fixture: ComponentFixture<ClinicsOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicsOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClinicsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
