import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Order, OrderStatus } from '../types/order';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'progress' | 'status'>) => void;
  updateOrderProgress: (id: string, progress: number) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const SIMULATION_INTERVAL = 3000; // 3 seconds for demo purposes

export const OrderProvider = React.memo(function OrderProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (orderData: Omit<Order, 'progress' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      status: 'not_ready',
      progress: 0,
      estimatedCompletionTime: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes from now
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderProgress = (id: string, progress: number) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          let status: OrderStatus = order.status;
          
          // Update status based on progress
          if (progress >= 100) {
            status = 'ready';
          } else if (progress > 0) {
            status = 'in_progress';
          }

          // Check if delayed
          if (order.estimatedCompletionTime && 
              new Date(order.estimatedCompletionTime) < new Date() && 
              progress < 100) {
            status = 'delayed';
          }

          return { ...order, progress, status };
        }
        return order;
      })
    );
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  // Simulate progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.status === 'not_ready' || order.status === 'in_progress') {
            const newProgress = Math.min(order.progress + 10, 100);
            let status = order.status;

            if (newProgress >= 100) {
              status = 'ready';
            } else if (newProgress > 0) {
              status = 'in_progress';
            }

            if (order.estimatedCompletionTime && 
                new Date(order.estimatedCompletionTime) < new Date() && 
                newProgress < 100) {
              status = 'delayed';
            }

            return { ...order, progress: newProgress, status };
          }
          return order;
        })
      );
    }, SIMULATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderProgress, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
});

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};