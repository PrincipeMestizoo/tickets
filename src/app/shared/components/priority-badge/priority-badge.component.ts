import { Component, Input } from '@angular/core';
import { TicketPriority } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-priority-badge',
  templateUrl: './priority-badge.component.html',
  styleUrls: ['./priority-badge.component.scss']
})
export class PriorityBadgeComponent {
  @Input({ required: true }) priority!: TicketPriority;

  private labels: Record<TicketPriority, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente'
  };

  get label(): string {
    return this.labels[this.priority];
  }
}
