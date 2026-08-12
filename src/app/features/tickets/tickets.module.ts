import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TicketsRoutingModule } from './tickets-routing.module';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { TicketCreateComponent } from './ticket-create/ticket-create.component';

@NgModule({
  declarations: [TicketListComponent, TicketDetailComponent, TicketCreateComponent],
  imports: [SharedModule, TicketsRoutingModule],
})
export class TicketsModule {}
