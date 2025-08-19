
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesService } from '../../../services/routes';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Route as RouteModel } from '../../../models/routes.model';
import { CollectionRequest } from '../../../models/collection-requests.model';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CollectionRequestService } from '../../../services/collection-request';

@Component({
  selector: 'app-route-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TagModule],
  templateUrl: './route-detail.html',
  styleUrls: ['./route-detail.css'],
})
export class RouteDetail {
  private readonly routesService = inject(RoutesService);
  private readonly collectionRequestService = inject(CollectionRequestService);
  private readonly route = inject(ActivatedRoute);
  routeId: number | undefined;

  routeData: RouteModel | null = null;
  requests: CollectionRequest[] = [];
  loading = true;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.routeId = id;

    this.routesService.getRoute(this.routeId).subscribe({
      next: (r) => {
        this.routeData = r;
      },
      error: (err) => console.error('Error loading route', err)
    });

    this.collectionRequestService.getRequestsForRoute(id).subscribe({
      next: (list) => {
        this.requests = list;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading requests for route', err);
        this.loading = false;
      }
    });
  }

  startRoute() {
    if (!this.routeData) return;

    this.routesService.setInProgress(this.routeData.id).subscribe({
      next: (updatedRoute) => {
        this.routeData = updatedRoute;
      },
      error: (err) => console.error('Error starting route', err)
    });
  }

  completeRoute() {
    if (!this.routeData) return;

    this.routesService.setCompleted(this.routeData.id).subscribe({
      next: (updatedRoute) => {
        this.routeData = updatedRoute;
      },
      error: (err) => console.error('Error completing route', err)
    });
  }
}
