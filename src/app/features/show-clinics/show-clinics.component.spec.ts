import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowClinicsComponent } from './show-clinics.component';

describe('ShowClinicsComponent', () => {
  let component: ShowClinicsComponent;
  let fixture: ComponentFixture<ShowClinicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowClinicsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowClinicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
