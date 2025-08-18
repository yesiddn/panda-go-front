import { Component } from '@angular/core';
import { RoutesService } from '../../services/routes';
import { Route } from '../../models/routes.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [ButtonModule, RouterLink],
  templateUrl: './routes.html',
  styleUrls: ['./routes.css'],
})
export class RoutesComponent {
  routes: Route[] = [];

  constructor(private routesService: RoutesService) {}

  ngOnInit(): void {
    this.routesService.getRoutes().subscribe((data) => {
      this.routes = data;
    });
  }
}
