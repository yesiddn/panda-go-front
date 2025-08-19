import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollectionRequestService } from '../../../services/collection-request';
import { CollectionRequest as CollectionRequestModel } from '../../../models/collection-requests.model';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-collection-request',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TableModule, CardModule, TagModule, ButtonModule, InputTextModule],
  templateUrl: './collection-request.html'
})
export class CollectionRequestPage {
  private readonly collectionRequestService = inject(CollectionRequestService);

  loading = true;
  filterText = '';
  requests: CollectionRequestModel[] = [];

  // Stats
  weekCount = 0;
  monthCount = 0;
  monthCompletedCount = 0;
  weekWeight = 0;
  monthWeight = 0;

  ngOnInit(): void {
    this.collectionRequestService.getAll().subscribe({
      next: (list) => {
        this.requests = list;
        this.computeStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading collection requests', err);
        this.loading = false;
      }
    });
  }

  private computeStats() {
    const now = new Date();
    const firstDayOfWeek = this.startOfWeek(now);
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let weekCount = 0;
    let monthCount = 0;
    let monthCompleted = 0;
    let weekWeight = 0;
    let monthWeight = 0;

    for (const r of this.requests) {
      const reqDate = this.parseDate(r.collection_date || r.request_date);
      const inWeek = reqDate >= firstDayOfWeek;
      const inMonth = reqDate >= firstDayOfMonth;

      if (inWeek) weekCount++;
      if (inMonth) monthCount++;

      const isCompleted = r.status === 'approved';
      if (inMonth && isCompleted) monthCompleted++;

      const weight = this.toNumber(r.weight_kg);
      if (inWeek && isCompleted) weekWeight += weight;
      if (inMonth && isCompleted) monthWeight += weight;
    }

    this.weekCount = weekCount;
    this.monthCount = monthCount;
    this.monthCompletedCount = monthCompleted;
    this.weekWeight = weekWeight;
    this.monthWeight = monthWeight;
  }

  private toNumber(val: any): number {
    if (val == null) return 0;
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  }

  private startOfWeek(date: Date): Date {
    const d = new Date(date);
    // Assuming week starts on Monday; adjust based on locale if needed
    const day = d.getDay(); // 0 (Sun) .. 6 (Sat)
    const diff = (day === 0 ? -6 : 1) - day; // Monday as 1
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private parseDate(value: string): Date {
    // value expected "YYYY-MM-DD" or ISO
    if (!value) return new Date(0);
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date(0) : d;
  }

  get filteredRequests(): CollectionRequestModel[] {
    const q = (this.filterText || '').toLowerCase();
    if (!q) return this.requests;
    return this.requests.filter(r => {
      const addr = String(r.address_snapshot || '').toLowerCase();
      const cat = (r.waste_category?.name || '').toLowerCase();
      const status = (r.status || '').toLowerCase();
      return addr.includes(q) || cat.includes(q) || status.includes(q);
    });
  }

  severityFor(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'approved': return 'success';
      case 'assigned': return 'info';
      case 'pending': return 'warning';
      case 'canceled': return 'danger';
      default: return 'info';
    }
  }
}
