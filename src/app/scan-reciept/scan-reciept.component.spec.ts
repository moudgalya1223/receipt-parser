import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanRecieptComponent } from './scan-reciept.component';

describe('ScanRecieptComponent', () => {
  let component: ScanRecieptComponent;
  let fixture: ComponentFixture<ScanRecieptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScanRecieptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScanRecieptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
