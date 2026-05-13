import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import { AlertResponse } from '../../../../core/models/responses/alert-response.model';
import { AlertsService } from '../../../../core/services/alerts';

@Component({
  selector: 'app-alerts-page',
  imports: [DatePipe],
  templateUrl: './alerts-page.html',
  styleUrl: './alerts-page.css'
})
export class AlertsPage implements OnInit {
  private readonly alertsService = inject(AlertsService);

  readonly alerts = signal<AlertResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(page = this.currentPage()): void {
    this.loading.set(true);
    this.error.set(null);

    this.alertsService.getAll(page, this.pageSize()).subscribe({
      next: (response) => {
        this.alerts.set(response.content);
        this.currentPage.set(response.number);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load alerts.');
        this.loading.set(false);
      }
    });
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.loadAlerts(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.loadAlerts(this.currentPage() + 1);
    }
  }
}