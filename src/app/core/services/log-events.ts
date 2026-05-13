import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from '../api-url';
import { PageResponse } from '../models/common/page-response.model';
import { LogEventRequest } from '../models/requests/log-event-request.model';
import { LogEventResponse } from '../models/responses/log-event-response.model';

@Injectable({
  providedIn: 'root'
})
export class LogEventsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = apiUrl('/api/log-events');

  getAll(page = 0, size = 10): Observable<PageResponse<LogEventResponse>> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.http.get<PageResponse<LogEventResponse>>(this.baseUrl, { params });
  }

  search(keyword: string, page = 0, size = 10): Observable<PageResponse<LogEventResponse>> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<PageResponse<LogEventResponse>>(`${this.baseUrl}/search`, { params });
  }

  getById(id: number): Observable<LogEventResponse> {
    return this.http.get<LogEventResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: LogEventRequest): Observable<LogEventResponse> {
    return this.http.post<LogEventResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: LogEventRequest): Observable<LogEventResponse> {
    return this.http.put<LogEventResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
