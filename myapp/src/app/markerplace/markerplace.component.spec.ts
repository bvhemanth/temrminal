import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerplaceComponent } from './markerplace.component';

describe('MarkerplaceComponent', () => {
  let component: MarkerplaceComponent;
  let fixture: ComponentFixture<MarkerplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
