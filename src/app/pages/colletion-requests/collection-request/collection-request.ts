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
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-collection-request',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TableModule, CardModule, TagModule, ButtonModule, InputTextModule, ChartModule],
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

  // Charts
  statusChartData: any;
  statusChartOptions: any;
  weightChartData: any;
  weightChartOptions: any;
  private monthlyLabels: string[] = [];
  private monthlyWeights: number[] = [];

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
    const monthsWindow = this.getLastNMonths(6); // últimos 6 meses
    const monthKeys = new Set(monthsWindow.map(m => m.key));
    const monthWeightByKey: Record<string, number> = Object.fromEntries(monthsWindow.map(m => [m.key, 0]));

    let weekCount = 0;
    let monthCount = 0;
    let monthCompleted = 0;
    let weekWeight = 0;
    let monthWeight = 0;
    const monthStatusCounts: Record<'pending' | 'assigned' | 'approved' | 'canceled', number> = {
      pending: 0,
      assigned: 0,
      approved: 0,
      canceled: 0,
    };

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

      if (inMonth) {
        // count all statuses for the month distribution
        if (r.status in monthStatusCounts) {
          monthStatusCounts[r.status as keyof typeof monthStatusCounts]++;
        }
      }

      // accumulate monthly weights for last N months window
      const monthKey = this.monthKey(reqDate);
      if (isCompleted && monthKeys.has(monthKey)) {
        monthWeightByKey[monthKey] = (monthWeightByKey[monthKey] || 0) + weight;
      }
    }

    this.weekCount = weekCount;
    this.monthCount = monthCount;
    this.monthCompletedCount = monthCompleted;
    this.weekWeight = weekWeight;
    this.monthWeight = monthWeight;

    // build monthly arrays aligned with the window order
    this.monthlyLabels = monthsWindow.map(m => m.label);
    this.monthlyWeights = monthsWindow.map(m => monthWeightByKey[m.key] || 0);

    this.buildCharts(monthStatusCounts);
  }

  private buildCharts(monthStatusCounts: Record<'pending' | 'assigned' | 'approved' | 'canceled', number>) {
    // Pie chart for status distribution (current month)
    this.statusChartData = {
      labels: ['Pendiente', 'Asignada', 'Aprobada', 'Cancelada'],
      datasets: [
        {
          data: [
            monthStatusCounts.pending,
            monthStatusCounts.assigned,
            monthStatusCounts.approved,
            monthStatusCounts.canceled,
          ],
          backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'],
          hoverBackgroundColor: ['#D97706', '#2563EB', '#059669', '#DC2626'],
        },
      ],
    };
    this.statusChartOptions = {
      plugins: {
        legend: { position: 'bottom' },
      },
      maintainAspectRatio: false,
      responsive: true,
    };

    // Bar chart for recycled weight month-by-month (last N months)
    this.weightChartData = {
      labels: this.monthlyLabels,
      datasets: [
        {
          label: 'Peso reciclado (kg)',
          data: this.monthlyWeights,
          backgroundColor: '#10B981',
        },
      ],
    };
    this.weightChartOptions = {
      plugins: {
        legend: { display: true },
      },
      scales: {
        y: { beginAtZero: true },
      },
      maintainAspectRatio: false,
      responsive: true,
    };
  }

  private getLastNMonths(n: number): { key: string; label: string }[] {
    const res: { key: string; label: string }[] = [];
    const names = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `${names[d.getMonth()]} ${d.getFullYear()}`;
      res.push({ key, label });
    }
    return res;
  }

  private monthKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
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
