import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private user = { name: 'Mihai Marian', email: 'mihai@example.com' };

  getUser(): { name: string, email: string } {
    return this.user;
  }
}
