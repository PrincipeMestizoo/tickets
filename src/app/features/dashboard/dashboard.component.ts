import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TicketService } from '../../core/services/ticket.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User | null = this.authService.currentUser;
  loading = true;
  openCount = 0;
  inProgressCount = 0;
  resolvedCount = 0;

  constructor(private authService: AuthService, private ticketService: TicketService) {}

  ngOnInit(): void {
    // Resumen rápido usando el mismo endpoint de tickets con distintos filtros.
    this.ticketService.getTickets({ status: 'open', pageSize: 1 }).subscribe(res => this.openCount = res.total);
    this.ticketService.getTickets({ status: 'in_progress', pageSize: 1 }).subscribe(res => this.inProgressCount = res.total);
    this.ticketService.getTickets({ status: 'resolved', pageSize: 1 }).subscribe({
      next: res => { this.resolvedCount = res.total; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  get welcomeMessage(): string {
    const byRole: Record<string, string> = {
      client: 'Consulta el estado de tus solicitudes de soporte.',
      agent: 'Aquí tienes un resumen de los tickets asignados.',
      admin: 'Panorama general de la operación de soporte.',
    };
    return this.user ? byRole[this.user.role] : '';
  }
}
