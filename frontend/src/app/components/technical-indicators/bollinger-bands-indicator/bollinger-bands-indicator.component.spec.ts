import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BollingerBandsIndicatorComponent } from './bollinger-bands-indicator.component';

describe('BollingerBandsIndicatorComponent', () => {
  let component: BollingerBandsIndicatorComponent;
  let fixture: ComponentFixture<BollingerBandsIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BollingerBandsIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BollingerBandsIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
