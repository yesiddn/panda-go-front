import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company, CompanyRequest } from '../models/company.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private http = inject(HttpClient);
  private apiURL = environment.API_URL;

  /** Create a new company */
  create(payload: CompanyRequest): Observable<Company> {
    // POST to /companies (adjust path if your backend uses a different route)
    return this.http.post<Company>(`${this.apiURL}/companies/`, payload);
  }

  /** Get all companies */
  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiURL}/companies/`);
  }

  /** Get a single company by id */
  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiURL}/companies/${id}/`);
  }
}
