import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CollectionRequest, CollectionRequest as CollectionRequestModel, CreateCollectionRequestPayload } from '../models/collection-requests.model';
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

  /** Get collection requests that belong to a specific route */
  getRequestsForRoute(routeId: number): Observable<CollectionRequest[]> {
    return this.http.get<CollectionRequest[]>(`${this.API_URL}/route/${routeId}/`, { context: checkToken() }).pipe(
      // si "address_snapshot" es un objeto, extraer "address"
      map(requests => requests.map(req => ({
        ...req,
        address_snapshot: (req.address_snapshot && typeof req.address_snapshot === 'object' && 'address' in req.address_snapshot)
          ? (req.address_snapshot as { address: string }).address
          : req.address_snapshot
      })))
    )
  }

  /** Approve a collection request with reason and weight; endpoint returns 200 with empty body */
  approve(id: number, payload: { status_reason: string; weight_kg: string }): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/${id}/approve/`, payload, { context: checkToken() });
  }
}
