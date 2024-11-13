import React, { useState, useEffect } from 'react';
import { Package2, ListFilter, PlusCircle, Power, ChevronUp, ChevronDown } from 'lucide-react';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';
import { OrderProvider } from './context/OrderContext';

type ViewMode = 'all' | 'orders' | 'form';

export const App = React.memo(function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    return (view === 'orders' || view === 'form') ? view : 'all';
  });
  const [isOpen, setIsOpen] = useState(true);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (viewMode === 'all') {
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', viewMode);
    }
    window.history.replaceState({}, '', url.toString());
  }, [viewMode]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      setViewMode((view === 'orders' || view === 'form') ? view : 'all');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
  };

  return (
    <OrderProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          {showHeader && (
            <nav className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package2 className="h-6 w-6 text-[#00529C]" />
                    <span className="font-semibold text-xl text-gray-800">OrderTrack</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isOpen 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      <Power className="h-5 w-5" />
                      <span>{isOpen ? 'Open' : 'Closed'}</span>
                    </button>
                    {isOpen && (
                      <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => handleViewChange('all')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            viewMode === 'all' 
                              ? 'bg-white text-[#00529C] shadow-sm' 
                              : 'text-gray-600 hover:text-[#00529C]'
                          }`}
                        >
                          <ListFilter className="h-5 w-5" />
                          <span>All</span>
                        </button>
                        <button
                          onClick={() => handleViewChange('orders')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            viewMode === 'orders' 
                              ? 'bg-white text-[#00529C] shadow-sm' 
                              : 'text-gray-600 hover:text-[#00529C]'
                          }`}
                        >
                          <ListFilter className="h-5 w-5" />
                          <span>Orders</span>
                        </button>
                        <button
                          onClick={() => handleViewChange('form')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            viewMode === 'form' 
                              ? 'bg-white text-[#00529C] shadow-sm' 
                              : 'text-gray-600 hover:text-[#00529C]'
                          }`}
                        >
                          <PlusCircle className="h-5 w-5" />
                          <span>New</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </nav>
          )}
          <button
            onClick={() => setShowHeader(!showHeader)}
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
            aria-label={showHeader ? 'Hide header' : 'Show header'}
          >
            {showHeader ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {!isOpen && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 sm:mx-6 lg:mx-8 mt-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <Power className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  We are currently closed. No new orders are being accepted at this time.
                </p>
              </div>
            </div>
          </div>
        )}

        <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${showHeader ? 'py-8' : 'pt-12 pb-8'}`}>
          {isOpen ? (
            <div className={`grid gap-8 ${viewMode === 'all' ? 'md:grid-cols-[400px,1fr]' : ''}`}>
              {(viewMode === 'all' || viewMode === 'form') && (
                <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                  <OrderForm />
                </div>
              )}
              {(viewMode === 'all' || viewMode === 'orders') && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <OrderList />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <Power className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">System Closed</h2>
                <p className="text-gray-600">
                  The order tracking system is currently closed.<br />
                  Please check back during business hours.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </OrderProvider>
  );
});