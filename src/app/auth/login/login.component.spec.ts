import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockAuthService } from '../mock-auth.service';
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<MockAuthService>;
  let router: RouterStub;

  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    authServiceSpy = jasmine.createSpyObj('MockAuthService', ['login']);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: MockAuthService, useValue: authServiceSpy },
        { provide: Router, useClass: RouterStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as any;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should show error on failed login', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(throwError(() => 'Invalid'));
    component.loginForm.setValue({ email: 'wrong@example.com', password: 'bad' });
    component.login();
    tick(800);
    expect(component.loginError).toBe('Invalid');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBeNull();
  }));

  it('should login and store tokens on success', fakeAsync(() => {
    const mockResult = { token: 'jwt', csrf: 'csrf', role: 'user', expires: Date.now() + 10000 };
    authServiceSpy.login.and.returnValue(of(mockResult));
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.login();
    tick(800);
    expect(localStorage.getItem('token')).toBe('jwt');
    expect(sessionStorage.getItem('csrf')).toBe('csrf');
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    expect(component.loginError).toBeNull();
  }));

  it('should disable button and inputs when loading', fakeAsync(() => {
    // Use async Observable to simulate delay
    const mockResult = { token: 'jwt', csrf: 'csrf', role: 'user', expires: Date.now() + 10000 };
    authServiceSpy.login.and.returnValue(of(mockResult).pipe(delay(800)));
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.login();
    expect(component.loading).toBeTrue(); // Should be true before tick
    tick(800);
    expect(component.loading).toBeFalse();
  }));
});
