import React, { useState, useMemo } from "react";
import LandingView from "./components/LandingView";
import CustomerView from "./components/CustomerView";
import KitchenView from "./components/KitchenView";
import AdminView from "./components/AdminView";
import CartView from "./components/CartView";
import BillView from "./components/BillView";
import { CartItem, Order } from "./types";
import { Utensils, ChefHat, BarChart3, Home, CheckCircle } from "lucide-react";

type ViewState =
  | "landing"
  | "customer"
  | "kitchen"
  | "admin"
  | "cart"
  | "checkout"
  | "success";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>("landing");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // ✅ Dynamic Revenue Calculation
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "cancelled")
      .reduce((acc, order) => acc + (order.total || 0), 0);
  }, [orders]);

  // ✅ Order placement logic
  const placeOrder = (order: Order) => {
    setOrders((prev) => [...prev, order]);
    setCart([]);
    setCurrentView("success");
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  };

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <LandingView onNavigate={setCurrentView} />;
      case "customer":
        return (
          <CustomerView
            cart={cart}
            setCart={setCart}
            goToCart={() => setCurrentView("cart")}
          />
        );
      case "cart":
        return (
          <CartView
            cart={cart}
            setCart={setCart}
            goBack={() => setCurrentView("customer")}
            goToCheckout={() => setCurrentView("checkout")}
          />
        );
      case "checkout":
        return (
          <BillView
            cart={cart}
            placeOrder={placeOrder}
            goBack={() => setCurrentView("cart")}
          />
        );
      case "kitchen":
        return (
          <KitchenView orders={orders} updateOrderStatus={updateOrderStatus} />
        );
      case "admin":
        // ✅ Passing both orders and totalRevenue to AdminView
        return <AdminView orders={orders} totalRevenue={totalRevenue} />;
      case "success":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white/50">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle size={60} />
            </div>
            <h2 className="text-4xl font-bold text-[#013220] mb-3 font-serif">
              Payment Successful!
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md">
              Thank you for dining with ServeIQ. Your order has been sent to the
              kitchen. Anna will serve you shortly!
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView("customer")}
                className="bg-[#FF9933] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e68a2e] transition-all shadow-md"
              >
                Order More
              </button>
              <button
                onClick={() => setCurrentView("landing")}
                className="bg-[#013220] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#024a30] transition-all shadow-md"
              >
                Go Home
              </button>
            </div>
          </div>
        );
      default:
        return <LandingView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#FFFDD0]">
      <nav className="bg-[#013220] text-white p-4 shadow-md flex justify-between items-center z-50">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setCurrentView("landing")}
        >
          <div className="w-10 h-10 bg-[#FF9933] rounded-full flex items-center justify-center">
            <Utensils size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold font-serif tracking-wide hidden sm:block">
            Serve<span className="text-[#FF9933]">IQ</span>
          </h1>
        </div>

        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => setCurrentView("landing")}
            className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              currentView === "landing" ? "bg-[#FF9933]" : "hover:bg-white/10"
            }`}
          >
            <Home size={18} /> <span className="hidden sm:inline">Home</span>
          </button>
          <button
            onClick={() => setCurrentView("customer")}
            className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              ["customer", "cart", "checkout", "success"].includes(currentView)
                ? "bg-[#FF9933]"
                : "hover:bg-white/10"
            }`}
          >
            <Utensils size={18} />{" "}
            <span className="hidden sm:inline">Customer</span>
          </button>
          <button
            onClick={() => setCurrentView("kitchen")}
            className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              currentView === "kitchen" ? "bg-[#FF9933]" : "hover:bg-white/10"
            }`}
          >
            <ChefHat size={18} />{" "}
            <span className="hidden sm:inline">Kitchen</span>
            {orders.filter((o) => o.status === "pending").length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1 animate-pulse">
                {orders.filter((o) => o.status === "pending").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentView("admin")}
            className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              currentView === "admin" ? "bg-[#FF9933]" : "hover:bg-white/10"
            }`}
          >
            <BarChart3 size={18} />{" "}
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </nav>

      <main className="grow overflow-auto">{renderView()}</main>
    </div>
  );
}
