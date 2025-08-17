import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Token } from '../../../../services/token';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  private token = inject(Token);
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return this.token.isValidToken();
  }

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
