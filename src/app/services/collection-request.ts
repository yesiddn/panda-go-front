import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CollectionRequest as CollectionRequestModel, CreateCollectionRequestPayload } from '../models/collection-requests.model';
import { checkToken } from '../interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class CollectionRequestService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.API_URL}/requests`;

  getAll(): Observable<CollectionRequestModel[]> {
    return this.http.get<CollectionRequestModel[]>(`${this.API_URL}/`, { context: checkToken() });
  }

  getById(id: number): Observable<CollectionRequestModel> {
    return this.http.get<CollectionRequestModel>(`${this.API_URL}/${id}/`, { context: checkToken() });
  }

  create(payload: CreateCollectionRequestPayload): Observable<CollectionRequestModel> {
    return this.http.post<CollectionRequestModel>(`${this.API_URL}/`, payload, { context: checkToken() });
  }

  update(id: number, payload: CreateCollectionRequestPayload): Observable<CollectionRequestModel> {
    return this.http.put<CollectionRequestModel>(`${this.API_URL}/${id}/`, payload, { context: checkToken() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`, { context: checkToken() });
  }
}
