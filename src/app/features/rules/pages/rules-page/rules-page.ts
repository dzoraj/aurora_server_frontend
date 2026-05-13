import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PageResponse } from '../../../../core/models/common/page-response.model';
import { RuleRequest } from '../../../../core/models/requests/rule-request.model';
import { RuleResponse } from '../../../../core/models/responses/rule-response.model';
import { RulesService } from '../../../../core/services/rules';

@Component({
  selector: 'app-rules-page',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './rules-page.html',
  styleUrl: './rules-page.css'
})
export class RulesPage implements OnInit {
  private readonly rulesService = inject(RulesService);
  private readonly fb = inject(FormBuilder);

  readonly rules = signal<RuleResponse[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal('');

  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);

  readonly editingId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
    condition: ['', [Validators.required]],
    statusId: [1 as number],
    defaultSeverityId: [1 as number],
    enabled: [true],
    alertMessage: ['']
  });

  ngOnInit(): void {
    this.loadRules();
  }

  setSearchQuery(value: string): void {
    this.searchQuery.set(value);
  }

  loadRules(page = this.currentPage()): void {
    this.loading.set(true);
    this.error.set(null);
    const q = this.searchQuery().trim();
    const req =
      q.length > 0
        ? this.rulesService.searchByName(q, page, this.pageSize())
        : this.rulesService.getAll(page, this.pageSize());

    req.subscribe({
      next: (response: PageResponse<RuleResponse>) => this.applyPage(response, page),
      error: () => {
        this.error.set('Failed to load rules.');
        this.loading.set(false);
      }
    });
  }

  private applyPage(response: PageResponse<RuleResponse>, page: number): void {
    this.rules.set(response.content);
    this.currentPage.set(response.number);
    this.totalElements.set(response.totalElements);
    this.totalPages.set(response.totalPages);
    this.loading.set(false);
  }

  applySearch(): void {
    this.currentPage.set(0);
    this.loadRules(0);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(0);
    this.loadRules(0);
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.loadRules(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.loadRules(this.currentPage() + 1);
    }
  }

  startCreate(): void {
    this.editingId.set(null);
    this.form.reset();
    this.form.patchValue({
      name: '',
      description: '',
      condition: '',
      statusId: 1,
      defaultSeverityId: 1,
      enabled: true,
      alertMessage: ''
    });
  }

  startEdit(rule: RuleResponse): void {
    this.editingId.set(rule.id);
    this.form.patchValue({
      name: rule.name,
      description: rule.description ?? '',
      condition: rule.condition,
      statusId: 1,
      defaultSeverityId: 1,
      enabled: rule.enabled,
      alertMessage: rule.alertMessage ?? ''
    });
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: RuleRequest = {
      name: v.name,
      description: v.description || null,
      condition: v.condition,
      statusId: v.statusId,
      defaultSeverityId: v.defaultSeverityId,
      enabled: v.enabled,
      alertMessage: v.alertMessage || null
    };

    this.saving.set(true);
    this.error.set(null);
    const id = this.editingId();
    const call =
      id == null
        ? this.rulesService.create(payload)
        : this.rulesService.update(id, payload);

    call.subscribe({
      next: () => {
        this.saving.set(false);
        this.editingId.set(null);
        this.startCreate();
        this.loadRules(this.currentPage());
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Save failed. Check status/severity IDs exist in the database.');
      }
    });
  }

  toggle(rule: RuleResponse): void {
    const next = !rule.enabled;
    this.rulesService.toggleEnabled(rule.id, next).subscribe({
      next: (updated) => {
        this.rules.update((list) => list.map((r) => (r.id === updated.id ? updated : r)));
      },
      error: () => this.error.set('Could not toggle rule.')
    });
  }

  remove(rule: RuleResponse): void {
    if (!confirm(`Delete rule "${rule.name}"?`)) {
      return;
    }
    this.rulesService.delete(rule.id).subscribe({
      next: () => this.loadRules(this.currentPage()),
      error: () => this.error.set('Delete failed.')
    });
  }
}
