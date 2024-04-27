import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProphetPredictionComponent } from './prophet-prediction.component';

describe('ProphetPredictionComponent', () => {
  let component: ProphetPredictionComponent;
  let fixture: ComponentFixture<ProphetPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProphetPredictionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProphetPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
