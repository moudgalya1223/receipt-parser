import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
@Component({
  selector: 'app-scan-reciept',
  templateUrl: './scan-reciept.component.html',
  styleUrl: './scan-reciept.component.css'
})
export class ScanRecieptComponent implements OnInit {
  video: HTMLVideoElement | any;
  canvas: HTMLCanvasElement | undefined;
  context: CanvasRenderingContext2D | any;
  imageData: string | undefined;
  parsedAmount: string | undefined;
  constructor(private router:Router){}
ngOnInit(): void {
  this.initializeCamera()
}
initializeCamera() {
  this.video = document.createElement('video');
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      this.video.srcObject = stream;
      this.video.play();
    })
    .catch(err => {
      console.error('Camera access denied', err);
    })}
captureImage() {
  this.canvas = document.createElement('canvas');
  this.canvas.width = this.video.videoWidth;
  this.canvas.height = this.video.videoHeight;
  this.context = this.canvas.getContext('2d');
  this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
  this.imageData = this.canvas.toDataURL('image/png');
  this.sendToGoogleVision(this.imageData);  // Send captured image to Google Vision
}

sendToGoogleVision(imageData: string) {
  const apiKey = 'YOUR_GOOGLE_CLOUD_API_KEY';
  const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

  const requestBody = {
    requests: [{
      image: { content: imageData.split(',')[1] },  // Send Base64-encoded image
      features: [{ type: 'TEXT_DETECTION' }]
    }]
  };

  axios.post(visionApiUrl, requestBody)
    .then(response => {
      this.handleVisionApiResponse(response.data);
    })
    .catch(error => {
      console.error('Error calling Google Vision API', error);
    });
}

handleVisionApiResponse(response:any) {
  const parsedText = response.responses[0].fullTextAnnotation.text;
  this.extractAmount(parsedText);
}

extractAmount(text: string) {
  const amountRegex = /\d+\.\d{2}/;  // Regex to extract amount (e.g., 30.00)
  const amount = text.match(amountRegex);
  if (amount) {
    this.parsedAmount = amount[0]; // Store parsed amount
  }
}
goToPayment() {
  if (this.parsedAmount) {
   
    this.router.navigate(['/scan-qr']);

  } else {
    this.router.navigate(['/scan-qr']);
    alert('Amount not detected. Please try again.');
  }
}
}
