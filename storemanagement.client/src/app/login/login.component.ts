import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  Validators, 
  ReactiveFormsModule, 
  NonNullableFormBuilder,
  FormGroup,
  FormControl
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // Modern Angular 20 dependency injection
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // Traditional properties for state management
  hidePassword = true;
  isLoading = false;
  loginError: string | null = null;

  // Modern strongly-typed reactive form
  readonly loginForm = this.formBuilder.group({
    username: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
    password: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
    rememberMe: this.formBuilder.control(false)
  });

  // Computed properties as getter methods
  get isFormValid(): boolean {
    return this.loginForm.valid;
  }
  
  get canSubmit(): boolean {
    return this.isFormValid && !this.isLoading;
  }

  async onLogin(): Promise<void> {
    console.log('Login form submitted');
    console.log('Form valid:', this.loginForm.valid);
    console.log('Form value:', this.loginForm.value);
    
    if (!this.loginForm.valid) {
      console.log('Form is invalid, marking fields as touched');
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = null;
    
    const credentials: LoginCredentials = this.loginForm.getRawValue();
    console.log('Login attempt with credentials:', credentials);
    
    try {
      // Use the authentication service for login with real API
      console.log('Calling authentication API...');
      const response = await this.authService.login(credentials);
      
      console.log('Login successful!', response.message);
      console.log('Navigating to /dashboard...');
      await this.router.navigate(['/dashboard']);
      console.log('Navigation completed');
    } catch (error) {
      this.loginError = error instanceof Error ? error.message : 'Login failed. Please try again.';
      console.error('Login failed:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onForgotPassword(): void {
    console.log('Forgot password clicked');
    // TODO: Navigate to forgot password page
    // this.router.navigate(['/forgot-password']);
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  private markFormGroupTouched(): void {
    this.loginForm.markAllAsTouched();
  }

  // Strongly typed getter methods for template access
  get username() { 
    return this.loginForm.controls.username; 
  }
  
  get password() { 
    return this.loginForm.controls.password; 
  }
  
  get rememberMe() {
    return this.loginForm.controls.rememberMe;
  }
}
