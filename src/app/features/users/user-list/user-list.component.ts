import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = true;
  errorMsg = '';
  savingId: string | null = null;

  roles: UserRole[] = ['client', 'agent', 'admin'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => { this.users = users; this.loading = false; },
      error: () => { this.errorMsg = 'No fue posible cargar los usuarios.'; this.loading = false; }
    });
  }

  changeRole(user: User, role: UserRole): void {
    if (role === user.role) return;
    this.savingId = user.id;
    this.userService.updateRole(user.id, role).subscribe({
      next: (updated) => {
        user.role = updated.role;
        this.savingId = null;
      },
      error: () => { this.savingId = null; }
    });
  }
}
