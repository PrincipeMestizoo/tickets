import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  currentUser$ = this.authService.currentUser$;
  menuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  get roleLabel(): Record<User['role'], string> {
    return { admin: 'Administrador', agent: 'Agente', client: 'Cliente' };
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
