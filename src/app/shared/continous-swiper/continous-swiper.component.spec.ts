import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinousSwiperComponent } from './continous-swiper.component';

describe('ContinousSwiperComponent', () => {
  let component: ContinousSwiperComponent;
  let fixture: ComponentFixture<ContinousSwiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContinousSwiperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContinousSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
