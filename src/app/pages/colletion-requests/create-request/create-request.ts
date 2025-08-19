import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';

import { CollectionRequestService } from '../../../services/collection-request';
import { WasteCategoriesService } from '../../../services/waste-categories';
import { Locality } from '../../../services/locality';
import { LocationInfo } from '../../../models/location-info.model';
import { WasteCategory } from '../../../models/wasteCategories.model';
import { CreateCollectionRequestPayload } from '../../../models/collection-requests.model';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    InputTextModule,
    ButtonModule,
    DatePickerModule,
    Select
  ],
  templateUrl: './create-request.html'
})
export class CreateRequest {
  private fb = inject(FormBuilder);
  public readonly router = inject(Router);
  private readonly collectionRequestService = inject(CollectionRequestService);
  private readonly wasteCategoriesService = inject(WasteCategoriesService);
  private readonly localityService = inject(Locality);

  wasteCategories: WasteCategory[] = [];
  localities: LocationInfo[] = [];
  filteredLocalities: LocationInfo[] = [];
  minDate: Date = new Date();

  form = this.fb.group({
    collection_date: [null, Validators.required],
    address_snapshot: ['', Validators.required],
    notes: [''],
    locality: [null, Validators.required],
    waste_category: [null, Validators.required]
  });

  ngOnInit(): void {
    this.wasteCategoriesService.getAll().subscribe({
      next: (cats) => this.wasteCategories = cats,
      error: (err) => console.error('Error loading waste categories', err)
    });

    this.localityService.getAll().subscribe({
      next: (list) => this.localities = list,
      error: (err) => console.error('Error loading localities', err)
    });

    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  get collection_date() { return this.form.get('collection_date'); }
  get address_snapshot() { return this.form.get('address_snapshot'); }
  get localityControl() { return this.form.get('locality'); }
  get waste_category() { return this.form.get('waste_category'); }

  search(event: any) {
    this.localityService.search(event.query).subscribe((results: LocationInfo[]) => this.filteredLocalities = results);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value as any;
    const payload: CreateCollectionRequestPayload = {
      collection_date: this.formatDate(raw.collection_date),
      address_snapshot: raw.address_snapshot || '',
      notes: raw.notes || '',
      locality: raw.locality && typeof raw.locality === 'object' ? raw.locality.id : raw.locality,
      waste_category_id: raw.waste_category && typeof raw.waste_category === 'object' ? raw.waste_category.id : raw.waste_category
    };

    this.collectionRequestService.create(payload).subscribe({
      next: (created) => {
        // Navigate back to app dashboard after creating
        this.router.navigate(['/app']);
      },
      error: (err) => {
        console.error('Error creating collection request', err);
      }
    });
  }

  private formatDate(value: any): string {
    if (!value) return '';
    if (value instanceof Date) return value.toISOString().split('T')[0];
    try {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch (e) {}
    return String(value);
  }
}
