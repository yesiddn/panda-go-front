import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { CollectionRequestService } from '../../../services/collection-request';

@Component({
  selector: 'app-complete-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
  ],
  templateUrl: './complete-request.html',
})
export class CompleteRequest {
  private fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly collectionRequestService = inject(CollectionRequestService);

  private requestId: number | undefined;
  private backTo: number | undefined;

  form = this.fb.group({
    weight_kg: [null, [Validators.required, Validators.min(0)]],
    status_reason: [''],
  });

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams || {};
    if (params['backTo']) {
      this.backTo = Number(params['backTo']);
    }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/app/routes']);
      return;
    }
    this.requestId = id;
  }

  get weight_kg() {
    return this.form.get('weight_kg');
  }

  get status_reason() {
    return this.form.get('status_reason');
  }

  submit() {
    if (this.form.invalid || !this.requestId) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      weight_kg: this.form.value.weight_kg || '',
      status_reason: this.form.value.status_reason || ''
    };

    this.collectionRequestService.approve(this.requestId, payload).subscribe({
      next: () => {
        if (this.backTo) {
          this.router.navigate(['app/routes/detail', this.backTo]);
        }
        else {
          this.router.navigate(['/app/routes']);
        }
      },
      error: (err) => {
        console.error('Error completing request', err);
      },
    });
  }
}
