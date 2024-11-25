import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-scan-reciept',
  templateUrl: './scan-reciept.component.html',
  styleUrls: ['./scan-reciept.component.css']
})
export class ScanReceiptComponent implements OnInit {
  @ViewChild('video', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  imageData: string | undefined;
  parsedAmount: string | undefined;

  constructor(private router: Router, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.initializeCamera();
  }

  initializeCamera() {
    const videoElement = this.videoElement.nativeElement;

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
        videoElement.play();
      })
      .catch((err) => {
        console.error('Camera access denied:', err);
        alert('Unable to access the camera. Please check your permissions.');
      });
  }

  captureImage() {
    const videoElement = this.videoElement.nativeElement;
    const canvasElement = this.canvas.nativeElement;

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    const context = canvasElement.getContext('2d');
    if (context) {
      context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      const base64String = canvasElement.toDataURL('image/png').replace(/^data:image\/(png|jpeg);base64,/, '');
      this.imageData = base64String;

      this.sendToGoogleVision(base64String);
    } else {
      console.error('Failed to get canvas context.');
    }
  }

  sendToGoogleVision(imageData: string) {
    const apiKey = 'YOUR_GOOGLE_CLOUD_API_KEY'; // Replace with your API key
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestBody = {
      requests: [
        {
          image: { content: imageData },
          features: [{ type: 'TEXT_DETECTION' }],
        },
      ],
    };

    axios
      .post(visionApiUrl, requestBody)
      .then((response) => {
        this.handleVisionApiResponse(response.data);
      })
      .catch((error) => {
        console.error('Error calling Google Vision API:', error);
        alert('Failed to process the image. Please try again.');
      });
  }

  handleVisionApiResponse(response: any) {
    try {
      const parsedText = response.responses[0].fullTextAnnotation.text;
      this.extractAmount(parsedText);
    } catch (error) {
      console.error('Error parsing Vision API response:', error);
      alert('Unable to parse the receipt. Please try again.');
    }
  }

  extractAmount(text: string) {
    const amountRegex = /\d+\.\d{2}/; // Regex to extract amount (e.g., 30.00)
    const amount = text.match(amountRegex);
    if (amount) {
      this.parsedAmount = amount[0];
      this.storeAmountInFirestore();
    } else {
      alert('No amount detected. Please try again.');
    }
  }

  storeAmountInFirestore() {
    if (this.parsedAmount) {
      this.firestore.collection('receipts').add({
        amount: this.parsedAmount,
        timestamp: new Date()
      }).then(() => {
        console.log('Amount stored in Firestore!');
      }).catch((error: any) => {
        console.error('Error storing amount in Firestore:', error);
      });
    }
  }

  goToPayment() {
    if (this.parsedAmount) {
      this.router.navigate(['/scan-qr']);
    } else {
      alert('Amount not detected. Please try again.');
    }
  }
}