import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AlertsService } from '../../../../core/services/alerts';
import { IncidentsService } from '../../../../core/services/incidents';
import { LogEventsService } from '../../../../core/services/log-events';
import { RulesService } from '../../../../core/services/rules';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage implements OnInit {
  private readonly alertsService = inject(AlertsService);
  private readonly rulesService = inject(RulesService);
  private readonly incidentsService = inject(IncidentsService);
  private readonly logEventsService = inject(LogEventsService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly alertTotal = signal(0);
  readonly ruleTotal = signal(0);
  readonly incidentTotal = signal(0);
  readonly logEventTotal = signal(0);

  ngOnInit(): void {
    forkJoin({
      alerts: this.alertsService.getAll(0, 1),
      rules: this.rulesService.getAll(0, 1),
      incidents: this.incidentsService.getAll(0, 1),
      logs: this.logEventsService.getAll(0, 1)
    }).subscribe({
      next: ({ alerts, rules, incidents, logs }) => {
        this.alertTotal.set(alerts.totalElements);
        this.ruleTotal.set(rules.totalElements);
        this.incidentTotal.set(incidents.totalElements);
        this.logEventTotal.set(logs.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not reach the API. Is the Spring server running on port 8080?');
        this.loading.set(false);
      }
    });
  }
}
