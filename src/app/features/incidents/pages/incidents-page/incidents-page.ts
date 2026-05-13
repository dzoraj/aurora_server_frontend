import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PageResponse } from '../../../../core/models/common/page-response.model';
import { IncidentRequest } from '../../../../core/models/requests/incident-request.model';
import { IncidentResponse } from '../../../../core/models/responses/incident-response.model';
import { IncidentsService } from '../../../../core/services/incidents';

@Component({
  selector: 'app-incidents-page',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './incidents-page.html',
  styleUrl: './incidents-page.css'
})
export class IncidentsPage implements OnInit {
  private readonly incidentsService = inject(IncidentsService);
  private readonly fb = inject(FormBuilder);

  readonly incidents = signal<IncidentResponse[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly showOpenOnly = signal(false);

  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    severityId: [1 as number],
    statusId: [1 as number],
    assignedTo: [''],
    timeline: ['']
  });

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(page = this.currentPage()): void {
    this.loading.set(true);
    this.error.set(null);

    if (this.showOpenOnly()) {
      this.incidentsService.getOpen().subscribe({
        next: (list) => {
          this.incidents.set(list);
          this.totalElements.set(list.length);
          this.totalPages.set(1);
          this.currentPage.set(0);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load open incidents.');
          this.loading.set(false);
        }
      });
      return;
    }

    this.incidentsService.getAll(page, this.pageSize()).subscribe({
      next: (response: PageResponse<IncidentResponse>) => {
        this.incidents.set(response.content);
        this.currentPage.set(response.number);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load incidents.');
        this.loading.set(false);
      }
    });
  }

  toggleOpenFilter(): void {
    this.showOpenOnly.update((v) => !v);
    this.currentPage.set(0);
    this.loadIncidents(0);
  }

  previousPage(): void {
    if (this.showOpenOnly()) {
      return;
    }
    if (this.currentPage() > 0) {
      this.loadIncidents(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.showOpenOnly()) {
      return;
    }
    if (this.currentPage() < this.totalPages() - 1) {
      this.loadIncidents(this.currentPage() + 1);
    }
  }

  submitCreate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: IncidentRequest = {
      title: v.title,
      description: v.description || null,
      severityId: v.severityId,
      statusId: v.statusId,
      assignedTo: v.assignedTo || null,
      timeline: v.timeline || null
    };

    this.saving.set(true);
    this.incidentsService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.form.reset({
          title: '',
          description: '',
          severityId: 1,
          statusId: 1,
          assignedTo: '',
          timeline: ''
        });
        this.loadIncidents(this.currentPage());
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Create failed. Verify severity/status IDs exist.');
      }
    });
  }

  remove(incident: IncidentResponse): void {
    if (!confirm(`Delete incident "${incident.title}"?`)) {
      return;
    }
    this.incidentsService.delete(incident.id).subscribe({
      next: () => this.loadIncidents(this.currentPage()),
      error: () => this.error.set('Delete failed.')
    });
  }

  alertCount(incident: IncidentResponse): number {
    return incident.alertIds?.length ?? 0;
  }
}
