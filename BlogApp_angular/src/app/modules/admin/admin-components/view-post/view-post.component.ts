import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../user/user-service/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle, MatCardTitle
} from '@angular/material/card';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {AdminServiceService} from '../../admin-service/admin-service.service';

@Component({
  selector: 'app-view-post',
  imports: [
    DatePipe,
    FormsModule,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatChip,
    MatChipSet,
    MatFormField,
    MatGridList,
    MatGridTile,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatTooltip,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './view-post.component.html',
  styleUrl: './view-post.component.scss'
})
export class ViewPostComponent {

  postId;
  postData: any;

  commentForm!: FormGroup;
  comments: any = [];

  constructor(private adminService: AdminServiceService,
              private snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder){
    this.postId = Number(this.activatedRoute.snapshot.params['id']);
  }

  ngOnInit(){
    this.getPostById();

    this.commentForm = this.fb.group({
      content:[null, [Validators.required]]
    })
  }

  publishComment(){
    const content = this.commentForm.get('content')?.value;

    this.adminService.createComment(this.postId, content).subscribe({
      next: (res) => {
        this.snackBar.open("Comment posted successfully!", "OK", { duration: 3000 });
        this.commentForm.reset();
        this.getPostById();
        this.getCommentsByPostId();
      },
      error: (error) => {
        console.error('Error posting comment:', error);
        this.snackBar.open("Something went wrong! Please try again.", "OK", { duration: 3000 });
      }
    });
  }

  getPostById(){
    this.adminService.getPostById(this.postId).subscribe(res=>{
      this.postData = res;
      this.getCommentsByPostId();
    }, error =>{
      console.error('Error fetching post:', error);
      this.snackBar.open("Something went wrong!", "OK");
    })
  }

  getCommentsByPostId(){
    this.adminService.getCommentsByPostId(this.postId).subscribe(res=>{
      this.comments = res;
    }, error =>{
      this.snackBar.open("Something went wrong!", "OK");
    })
  }


  hasFile(post: any): boolean {
    const hasFile = post.returnedFile && post.returnedFile.length > 0;
    console.log('hasFile check:', { returnedFile: post.returnedFile, length: post.returnedFile?.length, result: hasFile });
    return hasFile;
  }

  isImage(post: any): boolean {
    if (!this.hasFile(post) || !post.fileName) return false;

    const extension = post.fileName.toLowerCase().split('.').pop();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
    console.log('isImage check:', { fileName: post.fileName, extension, result: isImage });
    return isImage;
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
        this.snackBar.open("Error at downloading the file!", "Ok");
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
