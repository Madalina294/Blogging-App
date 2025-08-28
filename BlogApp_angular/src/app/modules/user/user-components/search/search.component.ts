import { Component } from '@angular/core';
import {UserService} from '../../user-service/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle, MatCardTitle
} from '@angular/material/card';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {RouterLink} from '@angular/router';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-search',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatButton,
    MatIcon,
    NgIf,
    DatePipe,
    MatCard,
    MatCardActions,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatGridList,
    MatGridTile,
    MatIconButton,
    MatTooltip,
    NgForOf,
    RouterLink
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  results: any = [];
  postName: string = "";

  constructor(private userService: UserService,
              private snackBar: MatSnackBar) {
  }

  searchByPostName(){
    this.userService.getPostsByName(this.postName).subscribe((res)=>{
      this.results = res;
      console.log(this.results);
      if(this.results.length === 0){
        this.snackBar.open("Posts not found!", "Ok");
      }
    }, error => {
      this.snackBar.open("Posts not found!", "Ok");
      this.results = [];
    })
  }

  hasFile(post: any): boolean {
    return post.returnedFile && post.returnedFile.length > 0;
  }

  isImage(post: any): boolean {
    if (!this.hasFile(post) || !post.fileName) return false;

    const extension = post.fileName.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
  }

  isDocument(post: any): boolean {
    return this.hasFile(post) && !this.isImage(post);
  }

  getFileIcon(post: any): string {
    if (!this.hasFile(post)) return 'description';

    if (this.isImage(post)) {
      return 'image';
    } else {
      const extension = post.fileName?.toLowerCase().split('.').pop();
      switch (extension) {
        case 'pdf':
          return 'picture_as_pdf';
        case 'doc':
        case 'docx':
          return 'description';
        case 'xls':
        case 'xlsx':
          return 'table_chart';
        case 'ppt':
        case 'pptx':
          return 'slideshow';
        case 'txt':
          return 'article';
        default:
          return 'description';
      }
    }
  }

  getFileTypeDisplay(post: any): string {
    if (!this.hasFile(post) || !post.fileName) return '';

    if (this.isImage(post)) {
      return 'Imagine';
    } else {
      const extension = post.fileName.toLowerCase().split('.').pop();
      switch (extension) {
        case 'pdf':
          return 'Document PDF';
        case 'doc':
        case 'docx':
          return 'Document Word';
        case 'xls':
        case 'xlsx':
          return 'Spreadsheet Excel';
        case 'ppt':
        case 'pptx':
          return 'Prezentare PowerPoint';
        case 'txt':
          return 'Document text';
        default:
          return 'Fișier';
      }
    }
  }

  private getMimeType(fileName: string): string {
    if (!fileName) return 'image/jpeg';

    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'bmp':
        return 'image/bmp';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }

  private arrayBufferToBase64(buffer: any): string {
    if (!buffer) return '';

    // Dacă buffer-ul este deja string, returnează-l
    if (typeof buffer === 'string') {
      return buffer;
    }

    // Dacă este ArrayBuffer sau Uint8Array, convertește-l
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

  downloadFile(post: any) {
    if (this.hasFile(post)) {
      try {
        const mimeType = this.getMimeType(post.fileName);
        const base64Data = this.arrayBufferToBase64(post.returnedFile);
        const blob = this.base64ToBlob(base64Data, mimeType);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = post.fileName || 'file';
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        this.snackBar.open("Eroare la descărcarea fișierului!", "Ok");
      }
    }
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }


}
