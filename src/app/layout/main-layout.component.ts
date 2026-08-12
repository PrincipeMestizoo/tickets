import { Component } from '@angular/core';

/**
 * Shell visual para todas las rutas privadas (autenticadas):
 * Navbar arriba + Sidebar lateral + <router-outlet> para el contenido
 * de cada feature (dashboard, tickets, users).
 */
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {}
