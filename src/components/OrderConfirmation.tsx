import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';
import { WoltIcon } from './icons/WoltIcon';
import { GlovoIcon } from './icons/GlovoIcon';
import { UberIcon } from './icons/UberIcon';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import type { Order } from '../types/order';

const COMPANY_ICONS = {
  uber: UberIcon,
  wolt: WoltIcon,
  glovo: GlovoIcon,
} as const;

interface OrderConfirmationProps {
  order: Order;
  onClose: () => void;
}

export const OrderConfirmation = React.memo(function OrderConfirmation({ 
  order, 
  onClose 
}: OrderConfirmationProps) {
  const [timeLeft, setTimeLeft] = useState(5);
  const Icon = COMPANY_ICONS[order.company as keyof typeof COMPANY_ICONS];
  const showProgress = order.status === 'in_progress' || order.status === 'not_ready';
  const isDelayed = order.status === 'delayed';
  const trackingUrl = `https://track-order.example.com/${order.company}/${order.orderNumber}`;
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Order Confirmation</h3>
            <button
              onClick={handleClose}
              className="group relative text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#00529C]/5 rounded-lg">
              <div className="flex items-center space-x-4">
                <Icon className="h-8 w-8 text-[#00529C]" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">#{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{formatTime(order.timestamp)}</p>
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {(showProgress || isDelayed) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Progress: {Math.round(order.progress)}%
                  </span>
                  {order.estimatedCompletionTime && (
                    <span className="text-sm text-gray-500">
                      Est. completion: {formatTime(order.estimatedCompletionTime)}
                    </span>
                  )}
                </div>
                <ProgressBar 
                  progress={order.progress} 
                  isDelayed={isDelayed}
                />
              </div>
            )}

            <div className="flex flex-col items-center space-y-4">
              <QRCodeSVG
                value={trackingUrl}
                size={200}
                level="H"
                includeMargin
                imageSettings={{
                  src: "/vite.svg",
                  x: undefined,
                  y: undefined,
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
              <p className="text-sm text-gray-500">Scan to track your order</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Your order has been successfully registered and is now being processed.
                    You can track its status using the QR code above.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleClose}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close ({timeLeft}s)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});