import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-json-upload',
  templateUrl: './json-upload.component.html',
  styleUrls: ['./../app.component.css'],
  standalone: true,
  imports: [CommonModule, JsonPipe, FormsModule]
})
export class JsonUploadComponent {
  uploadedFile: File | null = null;
  errorMessage: string | null = null;
  jsonContent: any = null;
  rawJsonContent: any = null;
  isSorted = false;
  isAlreadySorted = false;
  showDownloadButton = false;
  sortMessage: string | null = null;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type === 'application/json') {
        this.errorMessage = null;
        this.uploadedFile = file;
        this.parseJsonFile(file);
      } else {
        this.errorMessage = 'Please upload a valid JSON file.';
        this.uploadedFile = null;
        this.jsonContent = null;
        this.rawJsonContent = null;
      }
    }
  }

  parseJsonFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        this.rawJsonContent = JSON.parse(e.target.result);
        this.jsonContent = JSON.parse(e.target.result);
        this.isSorted = false;
        this.isAlreadySorted = false;
        this.showDownloadButton = false;
        this.sortMessage = null;
      } catch (error) {
        this.errorMessage = 'Error parsing the JSON file.';
        this.jsonContent = null;
        this.rawJsonContent = null;
      }
    };
    reader.readAsText(file);
  }

  sortJson(): void {
    if (this.jsonContent) {
      this.jsonContent = this.sortJsonRecursive(this.jsonContent);
      this.isSorted = true;
      this.isAlreadySorted = JSON.stringify(this.jsonContent) === JSON.stringify(this.rawJsonContent);

      if (this.isAlreadySorted) {
        this.sortMessage = 'The files are identical. No sorting is required.';
        this.showDownloadButton = false;
      } else {
        this.sortMessage = 'The file has been sorted.';
        this.showDownloadButton = true;
      }
    } else {
      this.errorMessage = 'No JSON content to sort.';
    }
  }

  sortJsonRecursive(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortJsonRecursive(item));
    } else if (typeof obj === 'object' && obj !== null) {
      const sortedObj: any = {};
      Object.keys(obj)
        .sort()
        .forEach(key => {
          sortedObj[key] = this.sortJsonRecursive(obj[key]);
        });
      return sortedObj;
    } else {
      return obj;
    }
  }

  downloadJson(): void {
    if (this.jsonContent) {
      const blob = new Blob([JSON.stringify(this.jsonContent, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'formatted-json.json';
      link.click();
    }
  }

  clearJson(): void {
    this.uploadedFile = null;
    this.jsonContent = null;
    this.rawJsonContent = null;
    this.isSorted = false;
    this.isAlreadySorted = false;
    this.showDownloadButton = false;
    this.sortMessage = null;

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
