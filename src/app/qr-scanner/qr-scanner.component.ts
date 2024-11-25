import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.css'
})
export class QrScannerComponent {
  scanResult: string | undefined;
  parsedAmount: any;
  upiId: any ;

  onScanSuccess(result: string) {
    this.scanResult = result;
    this.processPayment(result);
    console.log("successsfull")
  }

  processPayment(qrData: string) {
    // Extract UPI details and pre-fill payment app
     this.upiId = qrData.split('&')[0].split('=')[1];
    const amount = this.parsedAmount; 
    // Use the parsed amount from the receipt
    console.log(this.upiId)
    this.redirectToUpiApp(this.upiId, amount);
  }

  redirectToUpiApp(upiId: string, amount: string) {
    const upiUrl = `upi://pay?pa=${upiId}&pn=Merchant&mc=0000&tid=1234567890&tr=transaction123&tn=Payment&am=${amount}&cu=INR`;
    window.location.href = upiUrl;
    if (!window.location.href) {
      alert('UPI not supported on this device. Please use a different method to pay.');
    }
  }

}