import React, { useState, useEffect, useMemo } from "react";
import { Order } from "../types";
import {
  Volume2,
  Clock,
  CheckCircle,
  AlertCircle,
  Timer,
  ChefHat,
} from "lucide-react";

interface KitchenViewProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
}

export default function KitchenView({
  orders,
  updateOrderStatus,
}: KitchenViewProps) {
  const activeOrders = orders.filter((o) => o.status !== "delivered");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedTime = (timestamp: Date) => {
    const diffInMins = Math.floor(
      (currentTime.getTime() - new Date(timestamp).getTime()) / 60000,
    );
    if (diffInMins < 1) return "Just now";
    return `${diffInMins} min${diffInMins > 1 ? "s" : ""}`;
  };

  const readOrder = (order: Order) => {
    if (!("speechSynthesis" in window)) return;

    const text = `Order ${order.id.slice(-4)}. ${order.items.map((i) => `${i.quantity} ${i.name} ${i.instructions ? "with " + i.instructions : ""}`).join(", ")}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  // Smart Batching Logic
  const batchedItems = useMemo(() => {
    const pendingAndPreparing = orders.filter(
      (o) => o.status === "pending" || o.status === "preparing",
    );
    const counts: Record<string, number> = {};

    pendingAndPreparing.forEach((order) => {
      order.items.forEach((item) => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      });
    });

    return Object.entries(counts)
      .filter(([_, count]) => count > 1) // Only show items with quantity > 1 for batching
      .sort((a, b) => b[1] - a[1]);
  }, [orders]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white font-mono flex flex-col lg:flex-row gap-6">
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-emerald-400 tracking-tighter">
            KITCHEN DISPLAY SYSTEM
          </h1>
          <div className="flex gap-4 text-sm">
            <span className="bg-gray-800 px-3 py-1 rounded text-gray-400">
              Active: {activeOrders.length}
            </span>
            <span className="bg-red-900/50 text-red-400 px-3 py-1 rounded border border-red-800">
              High Priority:{" "}
              {activeOrders.filter((o) => o.priority === "high").length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-gray-800 rounded-xl border-l-4 p-5 flex flex-col ${order.priority === "high" ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-emerald-500"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">#{order.id.slice(-4)}</h3>
                  <div className="flex flex-col mt-1 gap-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />{" "}
                      {new Date(order.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span
                      className={`text-sm font-bold flex items-center gap-1 ${
                        Math.floor(
                          (currentTime.getTime() -
                            new Date(order.timestamp).getTime()) /
                            60000,
                        ) > 15
                          ? "text-red-400"
                          : Math.floor(
                                (currentTime.getTime() -
                                  new Date(order.timestamp).getTime()) /
                                  60000,
                              ) > 10
                            ? "text-yellow-400"
                            : "text-emerald-400"
                      }`}
                    >
                      <Timer size={14} /> {getElapsedTime(order.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => readOrder(order)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-blue-400"
                    title="Read Order"
                  >
                    <Volume2 size={18} />
                  </button>
                  {order.priority === "high" && (
                    <AlertCircle className="text-red-500" size={24} />
                  )}
                </div>
              </div>

              <div className="flex-grow mb-6">
                <ul className="space-y-3">
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-start border-b border-gray-700/50 pb-2 last:border-0"
                    >
                      <div>
                        <span className="font-bold text-lg mr-2">
                          {item.quantity}x
                        </span>
                        <span className="text-gray-200">{item.name}</span>
                        {item.instructions && (
                          <p className="text-sm text-yellow-400 mt-1 bg-yellow-400/10 px-2 py-1 rounded inline-block">
                            Note: {item.instructions}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 mt-auto">
                {order.status === "pending" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "preparing")}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition"
                  >
                    Start Cooking
                  </button>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "ready")}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Mark Ready
                  </button>
                )}
                {order.status === "ready" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "delivered")}
                    className="w-full py-2 bg-gray-600 hover:bg-gray-500 text-white rounded font-bold transition"
                  >
                    Clear Order
                  </button>
                )}
              </div>
            </div>
          ))}
          {activeOrders.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
              <CheckCircle size={48} className="mb-4 opacity-20" />
              <p className="text-xl">No active orders. Kitchen is clear.</p>
            </div>
          )}
        </div>
      </div>

      {/* Smart Batching Sidebar */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 sticky top-6">
          <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2 mb-4">
            <ChefHat size={24} /> Smart Batching
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            AI suggests cooking these items together across all pending orders
            to save time.
          </p>

          {batchedItems.length > 0 ? (
            <div className="space-y-3">
              {batchedItems.map(([name, count]) => (
                <div
                  key={name}
                  className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700"
                >
                  <span className="font-medium text-gray-200">{name}</span>
                  <span className="bg-purple-500/20 text-purple-400 font-bold px-3 py-1 rounded-full border border-purple-500/30">
                    {count}x
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No batching opportunities right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
