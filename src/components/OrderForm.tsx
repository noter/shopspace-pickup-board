import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { AlertCircle } from 'lucide-react';
import { OrderConfirmation } from './OrderConfirmation';
import { WoltIcon } from './icons/WoltIcon';
import { GlovoIcon } from './icons/GlovoIcon';
import { UberIcon } from './icons/UberIcon';
import type { Order } from '../types/order';

const DELIVERY_COMPANIES = [
  { id: 'uber', name: 'Uber', icon: UberIcon },
  { id: 'wolt', name: 'Wolt', icon: WoltIcon },
  { id: 'glovo', name: 'Glovo', icon: GlovoIcon },
] as const;

interface FormErrors {
  company?: string;
  orderNumber?: string;
  submit?: string;
}

interface OrderFormProps {
  onSuccess?: () => void;
}

export const OrderForm = React.memo(function OrderForm({ onSuccess }: OrderFormProps) {
  const { addOrder } = useOrders();
  const [company, setCompany] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!company) {
      newErrors.company = 'Please select a delivery company';
    }

    if (!orderNumber.trim()) {
      newErrors.orderNumber = 'Order number is required';
    } else if (!/^[A-Za-z0-9-]+$/.test(orderNumber.trim())) {
      newErrors.orderNumber = 'Order number can only contain letters, numbers, and hyphens';
    } else if (orderNumber.length < 3 || orderNumber.length > 20) {
      newErrors.orderNumber = 'Order number must be between 3 and 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const newOrder = {
        id: Date.now().toString(),
        company,
        orderNumber: orderNumber.trim(),
        timestamp: new Date().toISOString(),
      };

      addOrder(newOrder as Order);
      setConfirmedOrder(newOrder as Order);
      onSuccess?.();

      // Reset form
      setCompany('');
      setOrderNumber('');
      setErrors({});
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to add order. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">New Order</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Delivery Company
            </label>
            <div className="flex justify-center gap-4">
              {DELIVERY_COMPANIES.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setCompany(id);
                    setErrors(prev => ({ ...prev, company: undefined }));
                  }}
                  className={`relative group flex-1 aspect-square flex items-center justify-center rounded-2xl bg-white transition-all ${
                    errors.company 
                      ? 'ring-2 ring-red-300' 
                      : company === id 
                        ? 'ring-2 ring-[#00529C]' 
                        : 'ring-1 ring-gray-200 hover:ring-gray-300'
                  }`}
                  aria-label={name}
                  title={name}
                >
                  <Icon className={`w-12 h-12 transition-transform group-hover:scale-105`} />
                  <span className="sr-only">{name}</span>
                </button>
              ))}
            </div>
            {errors.company && (
              <div className="mt-4 flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.company}
              </div>
            )}
          </div>

          {company && (
            <div className="animate-fadeIn">
              <div className="mb-6">
                <div className="h-px bg-gray-200" />
              </div>
              
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value);
                    setErrors(prev => ({ ...prev, orderNumber: undefined }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                    errors.orderNumber
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-[#00529C] focus:border-[#00529C]'
                  }`}
                  placeholder="Enter order number"
                  disabled={isSubmitting}
                  autoFocus
                />
                {errors.orderNumber && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.orderNumber}
                  </div>
                )}
              </div>

              {errors.submit && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="ml-3 text-sm text-red-700">{errors.submit}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-6 bg-[#00529C] text-white py-2 px-4 rounded-lg transition-all ${
                  isSubmitting
                    ? 'opacity-75 cursor-not-allowed'
                    : 'hover:bg-[#00529C]/90 focus:ring-2 focus:ring-offset-2 focus:ring-[#00529C]'
                }`}
              >
                {isSubmitting ? 'Adding Order...' : 'Add Order'}
              </button>
            </div>
          )}
        </form>
      </div>

      {confirmedOrder && (
        <OrderConfirmation
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}
    </>
  );
});