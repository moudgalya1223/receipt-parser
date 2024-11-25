import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanReceiptComponent } from './scan-reciept.component';

describe('ScanRecieptComponent', () => {
  let component: ScanReceiptComponent;
  let fixture: ComponentFixture<ScanReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScanReceiptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScanReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
