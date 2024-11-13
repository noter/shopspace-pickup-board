import React, { useState, useEffect } from "react";
import { Power } from "lucide-react";
import { OrderForm } from "./components/OrderForm";
import { OrderList } from "./components/OrderList";
import { OrderProvider } from "./context/OrderContext";

type ViewMode = "all" | "orders" | "form";

export const App = React.memo(function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    return view === "orders" || view === "form" ? view : "all";
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    if (viewMode === "all") {
      url.searchParams.delete("view");
    } else {
      url.searchParams.set("view", viewMode);
    }
    window.history.replaceState({}, "", url.toString());
  }, [viewMode]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const view = params.get("view");
      setViewMode(view === "orders" || view === "form" ? view : "all");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const [isOpen, setIsOpen] = useState(true);

  return (
    <OrderProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8`}>
          {isOpen ? (
            <div
              className={`grid gap-8 ${viewMode === "all" ? "md:grid-cols-[400px,1fr]" : ""}`}
            >
              {(viewMode === "all" || viewMode === "form") && (
                <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                  <OrderForm />
                </div>
              )}
              {(viewMode === "all" || viewMode === "orders") && (
                <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                  <OrderList />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <Power className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  System Closed
                </h2>
                <p className="text-gray-600">
                  The order tracking system is currently closed.
                  <br />
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
