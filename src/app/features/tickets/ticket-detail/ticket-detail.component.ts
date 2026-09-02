import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  Ticket,
  TicketPriority,
  TicketStatus,
} from '../../../core/models/ticket.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  loading = true;
  errorMsg = '';
  savingComment = false;
  savingUpdate = false;

  deleting = false;
  confirmDeleteOpen = false;

  agents: User[] = [];
  statuses: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];
  priorities: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];

  commentForm = this.fb.group({
    message: ['', [Validators.required, Validators.minLength(2)]],
  });

  updateForm = this.fb.group({
    status: [''],
    priority: [''],
    agentId: [''],
  });

  private ticketId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private userService: UserService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();

    if (this.authService.hasRole('admin')) {
      this.userService.getAgents().subscribe({
        next: (agents) => (this.agents = agents),
        error: () => {},
      });
    }
  }

  // Reglas visibles en el formulario según el rol (el backend valida de todas formas):
  /*
  
  get canEditStatus(): boolean {
    return this.authService.hasRole('admin') ||
      (this.authSe
      rvice.hasRole('agent') && this.ticket?.agentId === this.authService.currentUser?.id);
  }
  */

  get canChangeStatus(): boolean {
    return (
      this.authService.hasRole('admin') ||
      (this.authService.hasRole('agent') &&
        this.ticket?.assignedTo === this.authService.currentUser?.id)
    );
  }

  get canChangePriority(): boolean {
    return (
      this.authService.hasRole('admin') ||
      (this.authService.hasRole('agent') &&
        this.ticket?.assignedTo === this.authService.currentUser?.id)
    );
  }

  get canAssign(): boolean {
    return this.authService.hasRole('admin');
  }

  load(): void {
    this.loading = true;
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (t) => {
        this.ticket = t;
        this.updateForm.patchValue({
          status: t.status,
          priority: t.priority,
          agentId: t.assignedTo ?? '',
        });
        this.loading = false;

        // Los comentarios no vienen en el detalle del ticket: se piden aparte.
        this.ticketService.getComments(t.id).subscribe({
          next: (comments) => {
            this.ticket!.comments = comments;
          },
          error: () => {
            /* si falla, se queda "Aún no hay comentarios" */
          },
        });
      },
      error: () => {
        this.errorMsg = 'No fue posible cargar el ticket.';
        this.loading = false;
      },
    });
  }

  addComment(): void {
    if (this.commentForm.invalid || !this.ticket) return;
    this.savingComment = true;
    const body = this.commentForm.getRawValue().message!;

    this.ticketService.addComment(this.ticket.id, body).subscribe({
      next: () => {
        this.ticketService.getComments(this.ticket!.id).subscribe({
          next: (comments) => {
            this.ticket!.comments = comments;
            this.commentForm.reset();
            this.savingComment = false;
          },
          error: () => {
            this.savingComment = false;
          },
        });
      },
      error: () => {
        this.savingComment = false;
      },
    });
  }

  saveUpdate(): void {
    if (!this.ticket) return;
    this.savingUpdate = true;
    const { status, priority } = this.updateForm.getRawValue();

    this.ticketService
      .updateTicket(this.ticket.id, {
        status: this.canChangeStatus
          ? ((status || undefined) as TicketStatus)
          : undefined,
        priority: this.canChangePriority
          ? ((priority || undefined) as TicketPriority)
          : undefined,
      })
      .subscribe({
        next: (t) => {
          this.ticket = t;
          this.savingUpdate = false;
        },
        error: () => {
          this.savingUpdate = false;
        },
      });
  }

  assignAgent(): void {
    if (!this.ticket) return;
    const agentId = this.updateForm.getRawValue().agentId;
    if (!agentId) return;

    this.ticketService.assignTicket(this.ticket.id, agentId).subscribe({
      next: (t) => {
        this.ticket = t;
      },
      error: () => {},
    });
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }

  get canDelete(): boolean {
    return this.authService.hasRole('admin');
  }

  openDeleteConfirm(): void {
    this.confirmDeleteOpen = true;
  }

  cancelDelete(): void {
    this.confirmDeleteOpen = false;
  }

  confirmDelete(): void {
    if (!this.ticket) return;
    this.deleting = true;

    this.ticketService.deleteTicket(this.ticket.id).subscribe({
      next: () => {
        this.deleting = false;
        this.confirmDeleteOpen = false;
        this.router.navigate(['/tickets']);
      },
      error: () => {
        this.deleting = false;
        this.confirmDeleteOpen = false;
      },
    });
  }
}
