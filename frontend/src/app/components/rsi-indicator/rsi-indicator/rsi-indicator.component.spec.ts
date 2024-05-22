import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsiIndicatorComponent } from './rsi-indicator.component';

describe('RsiIndicatorComponent', () => {
  let component: RsiIndicatorComponent;
  let fixture: ComponentFixture<RsiIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RsiIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RsiIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
