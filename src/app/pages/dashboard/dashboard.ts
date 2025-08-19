import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { Auth } from '../../services/auth';
import { UserInfo } from '../../models/auth.model';
import { CollectionRequestService } from '../../services/collection-request';
import { CollectionRequest } from '../../models/collection-requests.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule, Tag, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export default class DashboardPage {
  private readonly authService = inject(Auth);
  private readonly collectionRequestService = inject(CollectionRequestService);
  userInfo: UserInfo | null = null;
  role: string = 'user';
  collectionRequests: CollectionRequest[] = [];

  ngOnInit() {
    this.authService.getUserInfo().subscribe({
      next: (userInfo) => {
        this.userInfo = userInfo;
        this.role = userInfo.groups && userInfo.groups.length ? userInfo.groups[0] : 'user';
      },
      error: (error) => {
        console.error('Error fetching user info:', error);
      }
    });

    this.collectionRequestService.getAll().subscribe({
      next: (collectionRequests) => {
        this.collectionRequests = collectionRequests;
      },
      error: (error) => {
        console.error('Error fetching collection requests:', error);
      }
    });
  }
}
