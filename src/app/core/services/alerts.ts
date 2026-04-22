import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AlertRequest } from '../models/requests/alert-request.model';
import { AlertResponse } from '../models/responses/alert-response.model';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/alerts';

  getAll(): Observable<AlertResponse[]> {
    return this.http.get<AlertResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<AlertResponse> {
    return this.http.get<AlertResponse>(`${this.apiUrl}/${id}`);
  }

  create(payload: AlertRequest): Observable<AlertResponse> {
    return this.http.post<AlertResponse>(this.apiUrl, payload);
  }

  update(id: number, payload: AlertRequest): Observable<AlertResponse> {
    return this.http.put<AlertResponse>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}