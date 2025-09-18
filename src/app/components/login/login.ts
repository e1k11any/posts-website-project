import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Define the form structure and validation rules
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return; // If form is not valid, do nothing
    }

    this.errorMessage = null; // Reset error message
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // On successful login, navigate to the home page
        this.router.navigate(['/']);
      },
      error: (err) => {
        // On error, display a message
        this.errorMessage = 'Invalid username or password. Please try again.';
        console.error(err);
      },
    });
  }
}
