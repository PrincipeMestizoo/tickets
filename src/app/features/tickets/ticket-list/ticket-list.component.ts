import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket, TicketFilters, TicketPriority, TicketStatus } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  loading = true;
  errorMsg = '';

  page = 1;
  pageSize = 8;
  total = 0;

  statusFilter: TicketStatus | '' = '';
  priorityFilter: TicketPriority | '' = '';

  statuses: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];
  priorities: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];

  constructor(
    private ticketService: TicketService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get canCreate(): boolean {
    return this.authService.hasRole('client', 'admin');
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  load(): void {
    this.loading = true;
    this.errorMsg = '';

    const filters: TicketFilters = {
      page: this.page,
      pageSize: this.pageSize,
      status: this.statusFilter || undefined,
      priority: this.priorityFilter || undefined,
    };

    this.ticketService.getTickets(filters).subscribe({
      next: (res) => {
        this.tickets = res.data;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'No fue posible cargar los tickets. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.load();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.load();
  }

  openTicket(id: string): void {
    this.router.navigate(['/tickets', id]);
  }
}
