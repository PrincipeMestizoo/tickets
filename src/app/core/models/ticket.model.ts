export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdBy: string;
  clientName?: string;
  assignedTo?: string | null;
  agentName?: string | null;
  createdAt: string;
  updatedAt?: string;
  comments?: TicketComment[];
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  agentId?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  page?: number;
  pageSize?: number;
}
