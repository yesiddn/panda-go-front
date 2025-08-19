import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocationInfo } from '../models/location-info.model';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Locality {
  private http = inject(HttpClient);
  private cache: LocationInfo[] | null = null;
    apiURL = environment.API_URL;

  /** Get all localities (cached) */
  getAll(): Observable<LocationInfo[]> {
    if (this.cache) {
      return of(this.cache);
    }
    return this.http.get<LocationInfo[]>(`${this.apiURL}/localities`).pipe(
      tap(data => this.cache = data)
    );
  }

  /** Search localities by name; uses cache if available */
  search(query: string): Observable<LocationInfo[]> {
    const q = (query || '').toLowerCase();
    if (!q) {
      return this.getAll();
    }

    if (this.cache) {
      return of(this.cache.filter(locality => locality.name.toLowerCase().includes(q)));
    }

    return this.getAll().pipe(
      map(list => list.filter(locality => locality.name.toLowerCase().includes(q)))
    );
  }
}
