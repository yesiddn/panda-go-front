import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RoutesService } from '../../services/routes';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { RouteRequest } from '../../models/routes.model';
import { DatePicker } from 'primeng/datepicker';
import { WasteCategoriesService } from '../../services/waste-categories';
import { Locality } from '../../services/locality';
import { LocationInfo } from '../../models/location-info.model';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Select } from 'primeng/select';
import { WasteCategory } from '../../models/wasteCategories.model';
import { Companies } from '../../services/companies';
import { Auth } from '../../services/auth';
import { UserInfo } from '../../models/auth.model';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-create-route',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    Select,
    ButtonModule,
    InputTextModule,
    DatePicker,
    InputNumberModule,
    ToastModule
  ],
  templateUrl: './create-route.html',
  styleUrls: ['./create-route.css'],
})
export class CreateRouteComponent {
  private fb = inject(FormBuilder);
  private readonly routesService = inject(RoutesService);
  private readonly authService = inject(Auth);
  private readonly wasteCategoriesService = inject(WasteCategoriesService);
  private readonly companiesService = inject(Companies);
  private readonly localityService = inject(Locality);
  public router = inject(Router);
  private userInfo: UserInfo | undefined;
  private companyInfo: Company | undefined;


  wasteCategories: WasteCategory[] = [];
  localities: LocationInfo[] = [];
  filteredLocalities: LocationInfo[] = [];
  form = this.fb.group({
    route_code: ['', Validators.required],
    route_date: [null, Validators.required],
    capacity_stops: [1, [Validators.required, Validators.min(1)]],
    capacity_weight_kg: ["0", Validators.required],
    start_time: [null, Validators.required],
    end_time: [null, Validators.required],
    notes: [''],
    waste_category: [null, Validators.required],
    locality: [null, Validators.required]
  });
  // la fecha minima es mañana
  minDate: Date = new Date();

  get locality() {
    return this.form.get('locality');
  }

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: (userInfo) => {
        this.userInfo = userInfo;
        this.loadData();
      },
      error: (err) => {
        console.error('Error loading user info', err);
        this.router.navigate(['/app']);
      }
    });

    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  // convenience getters for template validation checks
  get route_code() { return this.form.get('route_code'); }
  get route_date() { return this.form.get('route_date'); }
  get capacity_stops() { return this.form.get('capacity_stops'); }
  get capacity_weight_kg() { return this.form.get('capacity_weight_kg'); }
  get start_time() { return this.form.get('start_time'); }
  get end_time() { return this.form.get('end_time'); }
  get waste_category() { return this.form.get('waste_category'); }
  get localityControl() { return this.form.get('locality'); }

  loadData() {
    if (!this.userInfo?.company_id) {
      this.router.navigate(['/app']);
      return;
    }

    this.companiesService.getById(this.userInfo?.company_id).subscribe({
      next: (company) => {
        this.companyInfo = company;
        this.wasteCategories = this.companyInfo?.waste_categories || [];
      },
      error: (err) => {
        console.error('Error loading company info', err);
      }
    });


    this.wasteCategoriesService.getAll().subscribe({
      next: (wasteCategories) => {
        this.wasteCategories = wasteCategories.filter(wasteCategory => {
          return this.companyInfo?.waste_categories?.some(cat => cat.id === wasteCategory.id);
        });
      },
      error: (err) => {
        console.error('Error loading waste categories', err);
      }
    });

    // load localities
    this.localityService.getAll().subscribe({
      next: (localities) => {
        this.localities = localities;
      },
      error: (err) => {
        console.error('Error loading localities', err);
      }
    });
  }
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Build payload with proper typing
    const raw = this.form.value as any;

    const payload: RouteRequest = {
      route_code: raw.route_code || '',
      route_date: raw.route_date ? this.formatDate(raw.route_date) : '',
      capacity_stops: raw.capacity_stops || 1,
      capacity_weight_kg: raw.capacity_weight_kg ? String(raw.capacity_weight_kg) : '0',
      start_time: raw.start_time ? this.formatTime(raw.start_time) : '',
      end_time: raw.end_time ? this.formatTime(raw.end_time) : '',
      notes: raw.notes || '',
      waste_category_id: raw.waste_category && typeof raw.waste_category === 'object' ? raw.waste_category.id : raw.waste_category,
      locality_id: raw.locality && typeof raw.locality === 'object' ? raw.locality.id : raw.locality
    };
    console.log('Creating route with payload:', payload);
    this.routesService.createRoute(payload).subscribe({
      next: (route) => {
        this.router.navigate(['/app/routes']);
      },
      error: (err) => {
        console.error('Error creating route', err);
      }
    });
  }

  private formatDate(value: any): string {
    // Accept Date or string; return YYYY-MM-DD
    if (!value) return '';
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    // If PrimeNG calendar returns an object with "toDate" or similar, try to convert
    try {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch (e) {
      // fallback
    }
    return String(value);
  }

  search(event: any) {
    this.localityService.search(event.query).subscribe((results: LocationInfo[]) => this.filteredLocalities = results);
  }

  private formatTime(value: any): string {
    // Accept Date or string; return HH:MM
    if (!value) return '';
    if (value instanceof Date) {
      return value.toISOString().split('T')[1].substring(0, 5);
    }
    // If PrimeNG calendar returns an object with "toDate" or similar, try to convert
    try {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[1].substring(0, 5);
    } catch (e) {
      // fallback
    }
    return String(value);
  }
}
