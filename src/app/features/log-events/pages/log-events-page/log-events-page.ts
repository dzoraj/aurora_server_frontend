import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PageResponse } from '../../../../core/models/common/page-response.model';
import { LogEventRequest } from '../../../../core/models/requests/log-event-request.model';
import { LogEventResponse } from '../../../../core/models/responses/log-event-response.model';
import { LogEventsService } from '../../../../core/services/log-events';

@Component({
  selector: 'app-log-events-page',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './log-events-page.html',
  styleUrl: './log-events-page.css'
})
export class LogEventsPage implements OnInit {
  private readonly logEventsService = inject(LogEventsService);
  private readonly fb = inject(FormBuilder);

  readonly events = signal<LogEventResponse[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly keyword = signal('');

  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);

  readonly form = this.fb.nonNullable.group({
    sourceId: [1 as number, [Validators.required]],
    message: ['', [Validators.required]],
    severityId: [null as number | null],
    rawData: ['']
  });

  ngOnInit(): void {
    this.loadEvents();
  }

  setKeyword(value: string): void {
    this.keyword.set(value);
  }

  loadEvents(page = this.currentPage()): void {
    this.loading.set(true);
    this.error.set(null);
    const k = this.keyword().trim();
    const req =
      k.length > 0
        ? this.logEventsService.search(k, page, this.pageSize())
        : this.logEventsService.getAll(page, this.pageSize());

    req.subscribe({
      next: (response: PageResponse<LogEventResponse>) => {
        this.events.set(response.content);
        this.currentPage.set(response.number);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load log events.');
        this.loading.set(false);
      }
    });
  }

  applySearch(): void {
    this.currentPage.set(0);
    this.loadEvents(0);
  }

  clearSearch(): void {
    this.keyword.set('');
    this.currentPage.set(0);
    this.loadEvents(0);
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.loadEvents(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.loadEvents(this.currentPage() + 1);
    }
  }

  submitCreate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const sev = v.severityId;
    const severityId =
      sev === null || sev === undefined || Number.isNaN(Number(sev)) ? null : Number(sev);

    const payload: LogEventRequest = {
      sourceId: v.sourceId,
      message: v.message,
      severityId,
      rawData: v.rawData || null,
      timestamp: null
    };

    this.saving.set(true);
    this.logEventsService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.form.reset({
          sourceId: 1,
          message: '',
          severityId: null,
          rawData: ''
        });
        this.loadEvents(this.currentPage());
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Create failed. Ensure source ID exists in the database.');
      }
    });
  }

  remove(ev: LogEventResponse): void {
    if (!confirm('Delete this log event?')) {
      return;
    }
    this.logEventsService.delete(ev.id).subscribe({
      next: () => this.loadEvents(this.currentPage()),
      error: () => this.error.set('Delete failed.')
    });
  }
}
