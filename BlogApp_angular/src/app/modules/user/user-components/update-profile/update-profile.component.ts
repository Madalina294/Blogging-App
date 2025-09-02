import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {UserService} from '../../user-service/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageService} from '../../../../auth/services/storage/storage.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UpdateNotificationService } from '../../../../shared/services/update-notification.service';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel, MatError, MatHint} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {AdminServiceService} from '../../../admin/admin-service/admin-service.service';

@Component({
  selector: 'app-update-profile',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatInput,
    MatLabel,
    MatError,
    MatHint,
    MatCardContent,
    MatFormField,
    ReactiveFormsModule,
    NgIf,
    MatButton
  ],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent implements OnInit{
  updateForm!: FormGroup;
  isLoading = false;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private adminService: AdminServiceService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateProfileComponent>,
    private updateNotificationService: UpdateNotificationService
  ) {}

  ngOnInit() {
    this.currentUser = StorageService.getUser();
    this.initForm();
  }

  private initForm() {
    this.updateForm = this.fb.group({
      name: [this.currentUser?.name || '', [Validators.required, Validators.minLength(2)]],
      email: [this.currentUser?.email || '', [Validators.email]],
      password: ['', [
        // Validare opțională - doar dacă parola nu este goală
        this.conditionalPasswordValidator()
      ]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  private conditionalPasswordValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;

      // Dacă parola este goală, nu este o eroare (este opțională)
      if (!password || password.trim() === '') {
        return null;
      }

      // Dacă parola nu este goală, validează pattern-ul
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passwordPattern.test(password)) {
        return {
          pattern: {
            requiredPattern: 'At least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character',
            actualValue: password
          }
        };
      }

      return null;
    };
  }

  private passwordMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password');
    const confirm = group.get('confirmPassword');

    if (!password || !confirm) {
      return null;
    }

    // Dacă parola este goală, nu este nevoie de confirmare
    if (!password.value || password.value.trim() === '') {
      confirm.setErrors(null);
      return null;
    }

    // Dacă parola nu este goală, verifică dacă se potrivește cu confirmarea
    if (password.value !== confirm.value) {
      console.log('Password mismatch detected:', {
        password: password.value,
        confirmPassword: confirm.value,
        passwordLength: password.value?.length,
        confirmLength: confirm.value?.length
      });
      confirm.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirm.setErrors(null);
      return null;
    }
  };

  onSubmit() {
    if (this.updateForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.updateForm.value;
    const userId = parseInt(StorageService.getUserId());

    // Curăță datele înainte de trimitere
    const cleanedFormData = this.cleanFormData(formData);

    console.log('Form data before cleaning:', formData);
    console.log('Form data after cleaning:', cleanedFormData);

    if(StorageService.isAdminLoggedIn()){
      this.adminService.updateProfile(userId, cleanedFormData).subscribe({
        next: (response: any) => {
          // Actualizează StorageService cu noile date și token-ul
          StorageService.updateUserProfileWithToken(response.user, response.newToken);

          // Notifică alte componente despre actualizarea profilului
          this.updateNotificationService.notifyProfileUpdated();

          this.snackBar.open('Profile updated successfully! All your comments have been updated with your new name.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          this.dialogRef.close(true); // true = actualizare cu succes
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.snackBar.open(
            error.error?.error || 'Error updating profile',
            'Close',
            { duration: 5000 }
          );
          this.isLoading = false;
        }
      })
    }
    else if(StorageService.isCustomerLoggedIn()){
      this.userService.updateProfile(userId, cleanedFormData).subscribe({
        next: (response: any) => {
          // Actualizează StorageService cu noile date și token-ul
          StorageService.updateUserProfileWithToken(response.user, response.newToken);

          // Notifică alte componente despre actualizarea profilului
          this.updateNotificationService.notifyProfileUpdated();

          this.snackBar.open('Profile updated successfully! All your posts and comments have been updated with your new name.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          this.dialogRef.close(true); // true = actualizare cu succes
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.snackBar.open(
            error.error?.error || 'Error updating profile',
            'Close',
            { duration: 5000 }
          );
          this.isLoading = false;
        }
      });
    }
  }

  private cleanFormData(formData: any): any {
    const cleaned = { ...formData };

    // Dacă parola este goală, nu o trimite deloc și elimină confirmPassword
    if (!cleaned.password || cleaned.password.trim() === '') {
      delete cleaned.password;
      delete cleaned.confirmPassword;
    }
    // Dacă parola nu este goală, păstrează confirmPassword pentru validarea backend
    // confirmPassword va fi eliminat automat de backend după validare

    return cleaned;
  }
  private markFormGroupTouched() {
    Object.keys(this.updateForm.controls).forEach(key => {
      const control = this.updateForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  // Getter-uri pentru a evita erorile în template
  get nameControl() {
    return this.updateForm.get('name');
  }

  get emailControl() {
    return this.updateForm.get('email');
  }

  get passwordControl() {
    return this.updateForm.get('password');
  }

  get confirmPasswordControl() {
    return this.updateForm.get('confirmPassword');
  }

  // Metode helper pentru validări
  hasNameError(errorType: string): boolean {
    return this.nameControl?.hasError(errorType) || false;
  }

  hasEmailError(errorType: string): boolean {
    return this.emailControl?.hasError(errorType) || false;
  }

  hasPasswordError(errorType: string): boolean {
    return this.passwordControl?.hasError(errorType) || false;
  }

  hasConfirmPasswordError(errorType: string): boolean {
    return this.confirmPasswordControl?.hasError(errorType) || false;
  }

  // Metode helper pentru UX
  isPasswordEmpty(): boolean {
    return !this.passwordControl?.value || this.passwordControl.value.trim() === '';
  }

  shouldShowConfirmPassword(): boolean {
    return !this.isPasswordEmpty();
  }
}
