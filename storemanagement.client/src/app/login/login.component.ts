import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  Validators, 
  ReactiveFormsModule, 
  NonNullableFormBuilder
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

// Modern Angular 16 interface with better typing
interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

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
  // Modern Angular 16 dependency injection
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

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
    if (!this.loginForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = null;
    
    const credentials: LoginCredentials = this.loginForm.getRawValue();
    console.log('Login attempt:', credentials);
    
    try {
      await this.simulateLogin(credentials);
    } catch (error) {
      this.loginError = 'Login failed. Please try again.';
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

  private async simulateLogin(credentials: LoginCredentials): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Login successful!', credentials);
    
    // TODO: Replace with actual authentication service
    // await this.authService.login(credentials);
    // await this.router.navigate(['/dashboard']);
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
