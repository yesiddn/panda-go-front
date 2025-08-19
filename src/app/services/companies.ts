import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { WasteCategory } from '../models/wasteCategories.model';
import { map, Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class Companies {
  private http = inject(HttpClient);
  private apiURL = environment.API_URL;

  /** Get single category by id */
  getById(id: number): Observable<Company | undefined> {
    return this.http.get<Company>(`${this.apiURL}/companies/${id}/`).pipe(
      map(company => company)
    return this.http.get<Company>(`${this.apiURL}/companies/${id}/`);
  }
}
