import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
  PaginatedResponse,
  TicketFilters,
  TicketComment,
} from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly base = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) {}

  getTickets(
    filters: TicketFilters = {},
  ): Observable<PaginatedResponse<Ticket>> {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.priority) params = params.set('priority', filters.priority);
    params = params.set('page', String(filters.page ?? 1));
    params = params.set('pageSize', String(filters.pageSize ?? 10));
    return this.http.get<PaginatedResponse<Ticket>>(this.base, { params });
  }

  getTicketById(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.base}/${id}`);
  }

  createTicket(payload: CreateTicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.base, payload);
  }

  updateTicket(id: string, payload: UpdateTicketRequest): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.base}/${id}`, payload);
  }

  assignTicket(id: string, agentId: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.base}/${id}/assign`, { agentId });
  }

  addComment(id: string, message: string): Observable<TicketComment> {
    return this.http.post<TicketComment>(`${this.base}/${id}/comments`, {
      message,
    });
  }

  getComments(ticketId: string): Observable<TicketComment[]> {
    return this.http.get<TicketComment[]>(`${this.base}/${ticketId}/comments`);
  }
}
