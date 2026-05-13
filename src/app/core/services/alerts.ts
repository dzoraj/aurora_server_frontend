import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { apiUrl } from '../api-url';
import { AlertRequest } from '../models/requests/alert-request.model';
import { AlertResponse } from '../models/responses/alert-response.model';
import { PageResponse } from '../models/common/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = apiUrl('/api/alerts');

  getAll(page = 0, size = 10): Observable<PageResponse<AlertResponse>> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.http.get<PageResponse<AlertResponse>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<AlertResponse> {
    return this.http.get<AlertResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: AlertRequest): Observable<AlertResponse> {
    return this.http.post<AlertResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: AlertRequest): Observable<AlertResponse> {
    return this.http.put<AlertResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}