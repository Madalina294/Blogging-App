import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel, MatHint} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatChipGrid, MatChipInput, MatChipRemove, MatChipRow} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {NgForOf, NgIf} from '@angular/common';
import {UserService} from '../../user-service/user.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatInput,
    MatHint,
    MatButton,
    MatChipGrid,
    MatChipRow,
    MatChipRemove,
    MatIcon,
    MatChipInput,
    NgForOf,
    NgIf
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent implements OnInit {

  postForm!: FormGroup;
  tags:string[] = [];
  selectedFile: File | null = null;
  filePreview: string | null = null;
  isUploading = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar,
              private postService: UserService){}

  ngOnInit(){
    this.postForm = this.fb.group({
      name:[null, [Validators.required]],
      content:[null, [Validators.required, Validators.maxLength(5000)]],
      file: [null],
      fileName: [null]
    })
  }

  addTags(event: any){
    const value = (event.value || '').trim();
    if(value && !this.tags.includes(value)){
      this.tags.push(value);
    }
    // Clear the input value
    if (event.chipInput) {
      event.chipInput.clear();
    }
  }

  removeTags(tag: string){
    const index = this.tags.indexOf(tag);
    if(index >= 0){
      this.tags.splice(index, 1);
    }
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  createPost(){

    if (this.postForm.invalid) {
      this.snackBar.open("Please fill in all required fields", "OK");
      return;
    }

    // Validate file
    if (!this.selectedFile) {
      this.snackBar.open("Please select an image", "OK");
      return;
    }
    const formData : FormData = new FormData();

    formData.append("name", this.postForm.get('name')?.value);
    formData.append("content", this.postForm.get('content')?.value);
    //formData.append("postedBy", this.postForm.get('postedBy')?.value);
    
    // Adaugă tag-urile corect din array-ul this.tags
    this.tags.forEach(tag => {
      formData.append("tags", tag);
    });
    
    formData.append("fileName", this.postForm.get("fileName")?.value);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.postService.createNewPost(formData).subscribe(res => {
      this.snackBar.open("Post created successfully!", "Ok");
      this.router.navigateByUrl("/home");
    }, error=>{
      this.snackBar.open("Something went wrong!", "Ok");
    })
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (this.isValidFileType(file)) {
        this.selectedFile = file;
      } else {
        this.snackBar.open("Type of file not allowed!", "Ok", {
          duration: 5000
        });
        event.target.value = ''; // Reset input
      }
    }
  }

  private isValidFileType(file: File): boolean {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', // images
      'text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docs
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // spreadsheets
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation' // presentation
    ];

    return allowedTypes.includes(file.type);
  }

  removeSelectedFile() {
    this.selectedFile = null;
    this.filePreview = null;
    // Reset input file
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getFileIcon(): string {
    if (!this.selectedFile) return 'description';

    if (this.selectedFile.type.startsWith('image/')) {
      return 'image';
    } else if (this.selectedFile.type.includes('pdf')) {
      return 'picture_as_pdf';
    } else if (this.selectedFile.type.includes('word')) {
      return 'description';
    } else if (this.selectedFile.type.includes('excel') || this.selectedFile.type.includes('spreadsheet')) {
      return 'table_chart';
    } else if (this.selectedFile.type.includes('powerpoint') || this.selectedFile.type.includes('presentation')) {
      return 'slideshow';
    } else if (this.selectedFile.type.includes('text')) {
      return 'article';
    }

    return 'description';
  }

  getFileTypeDisplay(): string {
    if (!this.selectedFile) return '';

    if (this.selectedFile.type.startsWith('image/')) {
      return 'Image';
    } else if (this.selectedFile.type.includes('pdf')) {
      return 'PDF Document';
    } else if (this.selectedFile.type.includes('word')) {
      return 'WordDocument';
    } else if (this.selectedFile.type.includes('excel') || this.selectedFile.type.includes('spreadsheet')) {
      return 'Spreadsheet Excel';
    } else if (this.selectedFile.type.includes('powerpoint') || this.selectedFile.type.includes('presentation')) {
      return 'PowerPoint presentation';
    } else if (this.selectedFile.type.includes('text')) {
      return 'Text Document';
    }

    return 'Fișier';
  }

}
