import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }

  getAgents(): Observable<User[]> {
    return this.http.get<User[]>(this.base, { params: { role: 'agent' } as any });
  }

  updateRole(userId: string, role: UserRole): Observable<User> {
    return this.http.patch<User>(`${this.base}/${userId}/role`, { role });
  }
}
