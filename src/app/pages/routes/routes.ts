import { Component } from '@angular/core';
import { RoutesService } from '../../services/routes';
import { Route } from '../../models/routes.model';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [ButtonModule, Tag, RouterLink],
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
