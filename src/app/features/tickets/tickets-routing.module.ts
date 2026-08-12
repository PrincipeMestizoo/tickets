import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { TicketCreateComponent } from './ticket-create/ticket-create.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  { path: '', component: TicketListComponent },
  {
    path: 'new',
    component: TicketCreateComponent,
    canActivate: [RoleGuard],
    data: { roles: ['client', 'admin'] },
  },
  { path: ':id', component: TicketDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {}
