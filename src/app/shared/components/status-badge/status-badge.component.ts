import { Component, Input } from '@angular/core';
import { TicketStatus } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: TicketStatus;

  private labels: Record<TicketStatus, string> = {
    open: 'Abierto',
    in_progress: 'En progreso',
    resolved: 'Resuelto',
    closed: 'Cerrado'
  };

  get label(): string {
    return this.labels[this.status];
  }
}
