import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MockAuthService } from '../mock-auth.service';
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  loginForm;
  loginError: string | null = null;
  loading = false;

  constructor(private fb: FormBuilder, private router: Router, private auth: MockAuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    this.loginError = null;
    if (this.loginForm.valid) {
      this.loading = true;
      const email: string = this.loginForm.value.email ?? '';
      const password: string = this.loginForm.value.password ?? '';
      this.auth.login(email, password).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (result) => {
          // SECURITY DEMO: In a real app, the token would be set in an HttpOnly cookie by the server.
          // The CSRF token would be stored in memory or a non-persistent variable, not localStorage.
          // For demo purposes only:
          localStorage.setItem('token', result.token); // NOT recommended for production
          sessionStorage.setItem('csrf', result.csrf); // Simulate CSRF token storage
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          this.loginError = err;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
