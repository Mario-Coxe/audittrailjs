export interface AuditEvent {
  id?: string;            // opcional: UUID do evento
  type: string;           // "login", "update", "delete"
  category?: string;      // "auth", "db-change", "access"
  userId?: string;
  ip?: string;
  endpoint?: string;      // URL/rota
  method?: string;        // GET, POST, PUT, DELETE
  action: string;         // descrição curta
  payload?: any;          // dados adicionais
  createdAt: Date;        // quando o evento ocorreu
  metadata?: Record<string, any>; // info extra customizável
}
