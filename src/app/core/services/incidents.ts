import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from '../api-url';
import { PageResponse } from '../models/common/page-response.model';
import { IncidentRequest } from '../models/requests/incident-request.model';
import { IncidentResponse } from '../models/responses/incident-response.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = apiUrl('/api/incidents');

  getAll(page = 0, size = 10): Observable<PageResponse<IncidentResponse>> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.http.get<PageResponse<IncidentResponse>>(this.baseUrl, { params });
  }

  getOpen(): Observable<IncidentResponse[]> {
    return this.http.get<IncidentResponse[]>(`${this.baseUrl}/open`);
  }

  getById(id: number): Observable<IncidentResponse> {
    return this.http.get<IncidentResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: IncidentRequest): Observable<IncidentResponse> {
    return this.http.post<IncidentResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: IncidentRequest): Observable<IncidentResponse> {
    return this.http.put<IncidentResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateTimeline(id: number, timeline: string): Observable<IncidentResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain;charset=UTF-8' });
    return this.http.patch<IncidentResponse>(`${this.baseUrl}/${id}/timeline`, timeline, {
      headers
    });
  }
}
