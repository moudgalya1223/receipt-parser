import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'receipt-parser';
  hiddenComponents: any;

  letGo() {
    // Hiding both the button and the h1 by selecting their ids
    const button = document.getElementById('main-btn');
    const title = document.getElementById('main-title');
    
    if (button && title) {
      button.style.display = 'none';
      title.style.display = 'none';
    }
  }
}
