import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmaIndicatorComponent } from './sma-indicator.component';

describe('SmaIndicatorComponent', () => {
  let component: SmaIndicatorComponent;
  let fixture: ComponentFixture<SmaIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmaIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmaIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
