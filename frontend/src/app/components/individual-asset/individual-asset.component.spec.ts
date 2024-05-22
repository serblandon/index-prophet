import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualAssetComponent } from './individual-asset.component';

describe('IndividualAssetComponent', () => {
  let component: IndividualAssetComponent;
  let fixture: ComponentFixture<IndividualAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualAssetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndividualAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
