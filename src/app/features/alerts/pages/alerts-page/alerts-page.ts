import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertResponse } from '../../../../core/models/responses/alert-response.model';
import { AlertsService } from '../../../../core/services/alerts';

@Component({
  selector: 'app-alerts-page',
  imports: [],
  templateUrl: './alerts-page.html',
  styleUrl: './alerts-page.css',
})
export class AlertsPage implements OnInit {
  private readonly alertsService = inject(AlertsService);

  readonly alerts = signal<AlertResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.alertsService.getAll().subscribe({
      next: (data) => {
        this.alerts.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load alerts.');
        this.loading.set(false);
      }
    });
  }
}