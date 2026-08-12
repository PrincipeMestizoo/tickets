import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from './components/priority-badge/priority-badge.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { RelativeTimePipe } from './pipes/relative-time.pipe';

const DECLARATIONS = [
  NavbarComponent,
  SidebarComponent,
  LoadingSpinnerComponent,
  StatusBadgeComponent,
  PriorityBadgeComponent,
  ConfirmDialogComponent,
  RelativeTimePipe,
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ...DECLARATIONS,
  ],
})
export class SharedModule {}
