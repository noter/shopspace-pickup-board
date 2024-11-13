import React from "react";
import { useOrders } from "../context/OrderContext";
import { WoltIcon } from "./icons/WoltIcon";
import { GlovoIcon } from "./icons/GlovoIcon";
import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";
import type { Order } from "../types/order";
import { UberIcon } from "./icons/UberIcon.tsx";

const COMPANY_ICONS = {
  uber: UberIcon,
  wolt: WoltIcon,
  glovo: GlovoIcon,
} as const;

export const OrderList = React.memo(function OrderList() {
  const { orders } = useOrders();

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Orders</h2>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders yet</p>
        ) : (
          orders.map((order: Order) => {
            const Icon =
              COMPANY_ICONS[order.company as keyof typeof COMPANY_ICONS];
            const showProgress =
              order.status === "in_progress" || order.status === "not_ready";
            const isDelayed = order.status === "delayed";

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTime(order.timestamp)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {(showProgress || isDelayed) && (
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progress: {Math.round(order.progress)}%
                      </span>
                      {order.estimatedCompletionTime && (
                        <span className="text-sm text-gray-500">
                          Est. completion:{" "}
                          {formatTime(order.estimatedCompletionTime)}
                        </span>
                      )}
                    </div>
                    <ProgressBar
                      progress={order.progress}
                      isDelayed={isDelayed}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});
