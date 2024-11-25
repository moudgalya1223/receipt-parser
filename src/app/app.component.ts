import { Component, OnDestroy } from '@angular/core';
import { ScanReceiptComponent } from './scan-reciept/scan-reciept.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy{
  constructor(private router: Router) {}
navigateToScan() {
  this.router.navigate(['/scan']);
throw new Error('Method not implemented.');
}

  title = 'receipt-parser';
  ngOnDestroy(): void {
    
  }
}
