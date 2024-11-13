export type OrderStatus = 
  | 'pending'
  | 'in_progress'
  | 'not_ready'
  | 'delayed'
  | 'ready'
  | 'completed'
  | 'issued';

export interface Order {
  id: string;
  company: string;
  orderNumber: string;
  status: OrderStatus;
  timestamp: string;
  progress: number;
  estimatedCompletionTime?: string;
}