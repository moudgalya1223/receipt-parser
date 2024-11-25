import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan-reciept',
  templateUrl: './scan-reciept.component.html',
  styleUrls: ['./scan-reciept.component.css']
})
export class ScanReceiptComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  imageData: string | undefined;
  parsedAmount: string | undefined;
  private stream: MediaStream | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log(this.video.nativeElement);
    console.log(this.canvas.nativeElement);
  }

  ngAfterViewInit(): void {
    this.initializeCamera();
  }

  ngOnDestroy(): void {
    // Stop the camera stream when the component is destroyed to release resources
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  }

  initializeCamera() {
    const videoElement = this.video.nativeElement;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.stream = stream; // Store the stream to stop later
        videoElement.srcObject = stream;
        videoElement.play();
      })
      .catch((err) => {
        console.error('Camera access denied:', err);
        alert('Unable to access the camera. Please check your permissions.');
      });
  }

  captureImage() {
    const videoElement = this.video.nativeElement;
    const canvasElement = this.canvas.nativeElement;

    // Ensure video element has dimensions before capturing the image
    if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
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
        const base64String = canvasElement
          .toDataURL('image/png')
          .replace(/^data:image\/(png|jpeg);base64,/, '');
        this.imageData = base64String; // Store image data
        this.sendToGoogleVision(base64String); // Send Base64 string to Google Vision API
      } else {
        console.error('Failed to get canvas context.');
      }
    } else {
      alert('Video stream is not yet available.');
    }
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        this.imageData = imageData.split(',')[1]; // Extract Base64 string without the prefix
        this.sendToGoogleVision(this.imageData); // Send Base64 string to Google Vision API
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }

  sendToGoogleVision(imageData: string) {
    const apiKey = 'AIzaSyAt-15j4-RDY4T8XNv_aRKmu8hRB-D0COg';
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestBody = {
      requests: [
        {
          image: { content: imageData }, // Send Base64-encoded image
          features: [{ type: 'TEXT_DETECTION' }], // Request text detection
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
      this.parsedAmount = amount[0]; // Store parsed amount
    } else {
      alert('No amount detected. Please try again.');
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
