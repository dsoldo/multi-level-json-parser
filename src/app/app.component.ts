import { Component } from '@angular/core';
import { JsonUploadComponent } from './json-upload/json-upload.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [JsonUploadComponent]
})
export class AppComponent {
  title = 'Multi Level JSON Parser';
}
