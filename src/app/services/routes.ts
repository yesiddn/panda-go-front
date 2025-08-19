import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Route, RouteRequest } from '../models/routes.model';
import { environment } from '../../environments/environment';
import { checkToken } from '../interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.API_URL}/routes`;

  getRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(`${this.API_URL}/`, { context: checkToken() });
  }

  getRoute(id: number): Observable<Route> {
    return this.http.get<Route>(`${this.API_URL}/${id}/`, { context: checkToken() });
  }

  createRoute(route: RouteRequest): Observable<Route> {
    return this.http.post<Route>(`${this.API_URL}/`, route, { context: checkToken() });
  }

  updateRoute(id: number, route: RouteRequest): Observable<Route> {
    return this.http.put<Route>(`${this.API_URL}/${id}/`, route, { context: checkToken() });
  }

  deleteRoute(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`, { context: checkToken() });
  }

  /** Mark a route as in_progress */
  setInProgress(id: number): Observable<Route> {
    return this.http.post<Route>(`${this.API_URL}/${id}/set-in-progress/`, {}, { context: checkToken() });
  }

  /** Mark a route as completed */
  setCompleted(id: number): Observable<Route> {
    return this.http.post<Route>(`${this.API_URL}/${id}/set-completed/`, {}, { context: checkToken() });
  }
}
