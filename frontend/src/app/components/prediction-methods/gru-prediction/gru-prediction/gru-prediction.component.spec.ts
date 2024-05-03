import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruPredictionComponent } from './gru-prediction.component';

describe('GruPredictionComponent', () => {
  let component: GruPredictionComponent;
  let fixture: ComponentFixture<GruPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruPredictionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GruPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
