import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { WasteCategory } from '../models/wasteCategories.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WasteCategoriesService {
  private http = inject(HttpClient);
  private apiURL = environment.API_URL;
  private cache: WasteCategory[] | null = null;

  /** Get all waste categories (cached) */
  getAll(): Observable<WasteCategory[]> {
    if (this.cache) {
      return of(this.cache);
    }
    return this.http.get<WasteCategory[]>(`${this.apiURL}/waste-categories/`).pipe(
      tap(list => this.cache = list)
    );
  }

  /** Get single category by id */
  getById(id: number): Observable<WasteCategory | undefined> {
    if (this.cache) {
      const found = this.cache.find(c => c.id === id);
      return of(found);
    }
    return this.getAll().pipe(
      map(list => list.find(c => c.id === id))
    );
  }
}
