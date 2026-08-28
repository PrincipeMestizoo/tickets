import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<{ data: User[]; total: number }>(this.base).pipe(
      map(res => res.data)
    );
  }

  getAgents(): Observable<User[]> {
    return this.getUsers().pipe(
      map(users => users.filter(u => u.role === 'agent'))
    );
  }

  updateRole(userId: string, role: UserRole): Observable<User> {
    return this.http.patch<{ data: User }>(`${this.base}/${userId}/role`, { role }).pipe(
      map(res => res.data)
    );
  }
}