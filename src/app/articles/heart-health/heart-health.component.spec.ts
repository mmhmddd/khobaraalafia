import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartHealthComponent } from './heart-health.component';

describe('HeartHealthComponent', () => {
  let component: HeartHealthComponent;
  let fixture: ComponentFixture<HeartHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeartHealthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeartHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
