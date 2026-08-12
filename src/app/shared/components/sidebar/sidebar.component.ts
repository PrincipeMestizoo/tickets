import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: Array<'admin' | 'agent' | 'client'>;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private allItems: NavItem[] = [
    { label: 'Mis tickets', icon: '🎫', route: '/tickets', roles: ['client'] },
    { label: 'Tickets asignados', icon: '📌', route: '/tickets', roles: ['agent'] },
    { label: 'Todos los tickets', icon: '🗂️', route: '/tickets', roles: ['admin'] },
    { label: 'Nuevo ticket', icon: '➕', route: '/tickets/new', roles: ['client', 'admin'] },
    { label: 'Usuarios', icon: '👥', route: '/users', roles: ['admin'] },
  ];

  constructor(private authService: AuthService) {}

  get items(): NavItem[] {
    const role = this.authService.currentUser?.role;
    if (!role) return [];
    return this.allItems.filter(i => i.roles.includes(role));
  }
}
