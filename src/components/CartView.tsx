import React, { useState, useEffect } from "react";
import { CartItem } from "../types";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  Activity,
} from "lucide-react";
import { getMealAnalysis } from "../services/gemini";

interface CartViewProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  goBack: () => void;
  goToCheckout: () => void;
}

export default function CartView({
  cart,
  setCart,
  goBack,
  goToCheckout,
}: CartViewProps) {
  const [analysis, setAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (cart.length === 0) {
        setAnalysis("");
        return;
      }
      setIsAnalyzing(true);
      const result = await getMealAnalysis(
        cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          tags: item.tags,
          calories: item.calories,
        })),
      );
      setAnalysis(result);
      setIsAnalyzing(false);
    };

    // Debounce the analysis to avoid spamming the API when user rapidly changes quantities
    const timeoutId = setTimeout(() => {
      fetchAnalysis();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cart]);

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const updateInstructions = (id: string, instructions: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, instructions } : item)),
    );
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isPeakHour = new Date().getHours() >= 19 && new Date().getHours() <= 21;

  return (
    <div className="min-h-screen bg-[#FFFDD0] text-[#013220] p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-[#013220]/10">
        <div className="p-6 border-b border-[#013220]/10 flex items-center gap-4">
          <button
            onClick={goBack}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold font-serif text-[#FF9933] flex items-center gap-3">
            <ShoppingBag /> Your Order
          </h1>
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl">Your cart is empty.</p>
              <button
                onClick={goBack}
                className="mt-6 px-6 py-2 bg-[#013220] text-white rounded-full hover:bg-[#013220]/90 transition"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row gap-4 items-start md:items-center border-b border-gray-100 pb-6 last:border-0"
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <span className="font-bold text-lg">
                        ₹
                        {(isPeakHour ? item.price + 20 : item.price) *
                          item.quantity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      ₹{isPeakHour ? item.price + 20 : item.price} each
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 text-[#013220]"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 text-[#013220]"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Add instructions (e.g., less spicy)"
                        value={item.instructions || ""}
                        onChange={(e) =>
                          updateInstructions(item.id, e.target.value)
                        }
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-auto flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50"
                      />

                      <button
                        onClick={() => updateQuantity(item.id, -item.quantity)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-8">
                {cart.length > 0 && (
                  <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold">
                      <Sparkles size={18} />
                      <h3>Anna's Meal Analysis</h3>
                    </div>
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2 text-purple-500/70">
                        <Activity className="animate-spin" size={16} />
                        <span className="text-sm italic">
                          Analyzing your choices...
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-purple-900 leading-relaxed">
                        {analysis}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-between mb-2 text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between mb-4 text-gray-600">
                  <span>GST (5%)</span>
                  <span>₹{(total * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold border-t border-gray-200 pt-4">
                  <span>Total</span>
                  <span className="text-[#FF9933]">
                    ₹{(total * 1.05).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={goToCheckout}
                  className="w-full mt-6 py-4 bg-[#013220] text-white rounded-xl font-bold text-lg hover:bg-[#013220]/90 transition shadow-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
