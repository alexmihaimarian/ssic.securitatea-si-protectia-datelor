import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  // Simulate a user
  private readonly mockUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Demo User',
    role: 'user' // Simulate role-based access
  };

  /**
   * Simulate login. In a real app, the server would set an HttpOnly cookie and return a CSRF token.
   * Here, we return a mock JWT (with expiry), a mock CSRF token, and the user role for demonstration.
   * Also logs each login attempt for audit demo.
   */
  login(email: string, password: string): Observable<{ token: string; csrf: string; role: string; expires: number }> {
    return new Observable(observer => {
      setTimeout(() => {
        const now = Date.now();
        const expires = now + 5 * 60 * 1000; // Token expires in 5 minutes
        if (email === this.mockUser.email && password === this.mockUser.password) {
          // SECURITY DEMO: Log successful login
          console.log(`[AUDIT] Login success for: ${email} at ${new Date(now).toISOString()}`);
          // In a real app, the token would be set in an HttpOnly cookie, not accessible to JS
          // The CSRF token would be returned in the response body or a custom header
          observer.next({
            token: 'dummy-jwt-token',
            csrf: 'dummy-csrf-token',
            role: this.mockUser.role,
            expires
          });
          observer.complete();
        } else {
          // SECURITY DEMO: Log failed login
          console.warn(`[AUDIT] Login failed for: ${email} at ${new Date(now).toISOString()}`);
          observer.error('Email sau parolă incorectă!');
        }
      }, 800);
    });
  }

  /**
   * Simulate logout. In a real app, the server would clear the session cookie.
   */
  logout(): void {
    // In a real app, you would call an API endpoint to clear the session cookie
    // SECURITY DEMO: Log logout event
    console.log('[AUDIT] User logged out at', new Date().toISOString());
  }
}
