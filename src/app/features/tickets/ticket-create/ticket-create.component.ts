import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { TicketPriority } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent {
  loading = false;
  serverError = '';
  priorities: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    priority: ['medium' as TicketPriority, [Validators.required]],
  });

  constructor(private fb: FormBuilder, private ticketService: TicketService, private router: Router) {}

  get f() { return this.form.controls; }

  submit(): void {
    this.serverError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.form.getRawValue();

    this.ticketService.createTicket({
      title: payload.title!,
      description: payload.description!,
      priority: payload.priority!,
    }).subscribe({
      next: (ticket) => {
        this.loading = false;
        this.router.navigate(['/tickets', ticket.id]);
      },
      error: (err) => {
        this.loading = false;
        this.serverError = err?.error?.error?.message || 'No fue posible crear el ticket.';
      }
    });
  }
}
