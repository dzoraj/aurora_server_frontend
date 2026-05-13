import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from '../api-url';
import { PageResponse } from '../models/common/page-response.model';
import { RuleRequest } from '../models/requests/rule-request.model';
import { RuleResponse } from '../models/responses/rule-response.model';

@Injectable({
  providedIn: 'root'
})
export class RulesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = apiUrl('/api/rules');

  getAll(page = 0, size = 10): Observable<PageResponse<RuleResponse>> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.http.get<PageResponse<RuleResponse>>(this.baseUrl, { params });
  }

  searchByName(name: string, page = 0, size = 10): Observable<PageResponse<RuleResponse>> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<PageResponse<RuleResponse>>(`${this.baseUrl}/search`, { params });
  }

  getById(id: number): Observable<RuleResponse> {
    return this.http.get<RuleResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: RuleRequest): Observable<RuleResponse> {
    return this.http.post<RuleResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: RuleRequest): Observable<RuleResponse> {
    return this.http.put<RuleResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  toggleEnabled(id: number, enabled: boolean): Observable<RuleResponse> {
    const params = new HttpParams().set('enabled', String(enabled));
    return this.http.patch<RuleResponse>(`${this.baseUrl}/${id}/toggle`, null, { params });
  }
}
