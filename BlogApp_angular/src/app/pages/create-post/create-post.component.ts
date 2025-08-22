import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatChipGrid, MatChipInput, MatChipRemove, MatChipRow} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-create-post',
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    MatChipGrid,
    MatChipRow,
    MatChipRemove,
    MatIcon,
    MatChipInput,
    NgForOf
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent implements OnInit {

  postForm!: FormGroup;
  tags:string[] = [];

  constructor(private fb: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar) {}

  ngOnInit(){
    this.postForm = this.fb.group({
      name:[null, [Validators.required]],
      content:[null, [Validators.required, Validators.maxLength(5000)]],
      image: [null],
      postedBy: [null, [Validators.required]]
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
}
