import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Auth } from '../../services/auth';
import { UserInfo } from '../../models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export default class DashboardPage {
  private readonly authService = inject(Auth);
  userInfo: UserInfo | null = null;

  ngOnInit() {
    this.authService.getUserInfo().subscribe({
      next: (userInfo) => {
        this.userInfo = userInfo;
      },
      error: (error) => {
        console.error('Error fetching user info:', error);
      }
    });
  }
}
