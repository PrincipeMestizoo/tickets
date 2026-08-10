import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const allowedRoles: UserRole[] = route.data['roles'] ?? [];

    if (!this.authService.isLoggedIn) {
      return this.router.createUrlTree(['/auth/login']);
    }

    if (allowedRoles.length === 0 || this.authService.hasRole(...allowedRoles)) {
      return true;
    }

    return this.router.createUrlTree(['/dashboard']);
  }
}
