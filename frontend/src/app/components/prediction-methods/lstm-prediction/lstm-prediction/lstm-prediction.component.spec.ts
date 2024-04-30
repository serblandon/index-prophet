import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LstmPredictionComponent } from './lstm-prediction.component';

describe('LstmPredictionComponent', () => {
  let component: LstmPredictionComponent;
  let fixture: ComponentFixture<LstmPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LstmPredictionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LstmPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
