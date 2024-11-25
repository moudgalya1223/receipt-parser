import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScanReceiptComponent } from './scan-reciept/scan-reciept.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
const routes: Routes = [
  {path:'scan',component:ScanReceiptComponent},
  {path:'scan-qr',component:QrScannerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
