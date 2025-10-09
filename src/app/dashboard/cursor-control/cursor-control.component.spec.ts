import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursorControlComponent } from './cursor-control.component';

describe('CursorControlComponent', () => {
  let component: CursorControlComponent;
  let fixture: ComponentFixture<CursorControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursorControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CursorControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
