import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environment';  // Corrected path
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScanReceiptComponent } from './scan-reciept/scan-reciept.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
@NgModule({
  declarations: [
    AppComponent,
    ScanReceiptComponent,
    QrScannerComponent, 
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig), // Your Firebase config
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    
    ZXingScannerModule,
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
