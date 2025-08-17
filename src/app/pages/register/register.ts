import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Locality } from '../../services/locality';
import { Router, RouterModule } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { LocationInfo } from '../../models/location-info.model';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(Auth);
  private localityService = inject(Locality);

  localities: LocationInfo[] = [];
  filteredLocalities: LocationInfo[] = [];
  registrationError: string | null = null;
  isRegistering = false;

  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    role: ['user'],
    locality_id: [null, Validators.required]
  });

  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get password2() { return this.registerForm.get('password2'); }
  get email() { return this.registerForm.get('email'); }
  get first_name() { return this.registerForm.get('first_name'); }
  get last_name() { return this.registerForm.get('last_name'); }
  get locality_id() { return this.registerForm.get('locality_id'); }

  constructor() {
    // preload localities into service cache
    this.localityService.getAll().subscribe((data: LocationInfo[]) => this.localities = data);
  }

  search(event: any) {
    this.localityService.search(event.query).subscribe((results: LocationInfo[]) => this.filteredLocalities = results);
  }

  register(): void {
    if (!this.validateForm()) {
      return;
    }

    const payload = this.buildPayload();

    this.isRegistering = true;
    this.authService.register(payload).subscribe({
      next: (response) => this.handleRegisterSuccess(response, payload),
      error: (error) => this.handleRegisterError(error)
    });
  }

  private validateForm(): boolean {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  private buildPayload(): any {
    const raw = this.registerForm.value as any;
    return {
      ...raw,
      locality_id: raw.locality_id && typeof raw.locality_id === 'object' ? raw.locality_id.id : raw.locality_id
    };
  }

  private handleRegisterSuccess(response: any, payload: any) {
    console.log('Registration successful:', response);
    this.registrationError = null;

    // Attempt auto-login with provided credentials
    this.attemptAutoLogin(payload);
  }

  private attemptAutoLogin(payload: any) {
    this.authService.login(payload.username, payload.password).subscribe({
      next: () => {
        this.isRegistering = false;
        this.router.navigate(['/app']);
      },
      error: (loginErr) => {
        console.error('Auto-login failed after registration:', loginErr);
        this.isRegistering = false;
        this.router.navigate(['/login']);
      }
    });
  }

  private handleRegisterError(error: any) {
    console.error('Registration error:', error);
    let msg = 'Error al registrar. Por favor intenta nuevamente.';
    if (error && error.error) {
      if (typeof error.error === 'string') {
        msg = error.error;
      } else if (error.error.detail) {
        msg = error.error.detail;
      } else if (typeof error.error === 'object') {
        try {
          // Only show the first error message found (ignore the rest)
          for (const key of Object.keys(error.error)) {
            const val = error.error[key];
            if (Array.isArray(val) && val.length > 0) {
              msg = typeof val[0] === 'string' ? val[0] : String(val[0]);
            } else if (typeof val === 'string') {
              msg = val;
            } else if (val != null) {
              msg = String(val);
            }
            if (msg) break;
          }
        } catch (e) {
          // ignore parse errors
        }
      }
    }

    this.registrationError = msg;
    this.isRegistering = false;
  }
}
