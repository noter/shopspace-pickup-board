import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, Package2, Truck } from 'lucide-react';
import type { OrderStatus } from '../types/order';

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    text: 'Pending',
    className: 'bg-yellow-100 text-yellow-700',
  },
  in_progress: {
    icon: Package2,
    text: 'In Progress',
    className: 'bg-blue-100 text-blue-700',
  },
  not_ready: {
    icon: Clock,
    text: 'Not Ready',
    className: 'bg-gray-100 text-gray-700',
  },
  delayed: {
    icon: AlertTriangle,
    text: 'Delayed',
    className: 'bg-red-100 text-red-700',
  },
  ready: {
    icon: CheckCircle2,
    text: 'Ready',
    className: 'bg-green-100 text-green-700',
  },
  completed: {
    icon: CheckCircle2,
    text: 'Completed',
    className: 'bg-green-100 text-green-700',
  },
  issued: {
    icon: Truck,
    text: 'Issued',
    className: 'bg-purple-100 text-purple-700',
  },
} as const;

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge = React.memo(function StatusBadge({ 
  status 
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${config.className}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
});