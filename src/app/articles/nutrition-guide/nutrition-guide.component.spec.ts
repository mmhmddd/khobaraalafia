import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionGuideComponent } from './nutrition-guide.component';

describe('NutritionGuideComponent', () => {
  let component: NutritionGuideComponent;
  let fixture: ComponentFixture<NutritionGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionGuideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NutritionGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
