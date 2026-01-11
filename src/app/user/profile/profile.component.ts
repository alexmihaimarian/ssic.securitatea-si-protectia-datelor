import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: { name: string, email: string } | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  logout(): void {
    // SECURITY DEMO: In a real app, you would call an API to clear the session cookie.
    localStorage.removeItem('token');
    sessionStorage.removeItem('csrf'); // clear CSRF token if present
    location.href = '/login';
  }
}
