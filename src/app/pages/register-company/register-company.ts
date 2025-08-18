import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

import { WasteCategory } from '../../models/wasteCategories.model';
import { CompanyRequest } from '../../models/company.model';
import { WasteCategoriesService } from '../../services/waste-categories';
import { CompanyService } from '../../services/company';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule
  ],
  templateUrl: './register-company.html'
})
export class RegisterCompany implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private wasteCategoriesService = inject(WasteCategoriesService);
  private companyService = inject(CompanyService);

  companyForm!: FormGroup;
  wasteCategories: WasteCategory[] = [];
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.wasteCategoriesService.getAll().subscribe(categories => {
      this.wasteCategories = categories;
    });

    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
      waste_category_ids: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  createCompany(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    const companyRequest: CompanyRequest = this.companyForm.value;

    this.companyService.create(companyRequest).subscribe({
      next: (company) => {
        this.router.navigate(['/register'], { queryParams: { companyId: company.id, isEmployee: true } });
      },
      error: (err) => {
        this.errorMessage = 'Error creating company. Please try again.';
        console.error(err);
      }
    });
  }
}
