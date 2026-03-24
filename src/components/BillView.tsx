import React, { useState } from "react";
import { CartItem, Order } from "../types";
import {
  CheckCircle,
  CreditCard,
  Smartphone,
  Banknote,
  ArrowLeft,
  Users,
  Heart,
} from "lucide-react";

interface BillViewProps {
  cart: CartItem[];
  placeOrder: (order: Order) => void;
  goBack: () => void;
}

export default function BillView({ cart, placeOrder, goBack }: BillViewProps) {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cash">(
    "upi",
  );
  const [isPaid, setIsPaid] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [finalTotal, setFinalTotal] = useState(0);
  const [splitCount, setSplitCount] = useState(1);
  const [tipPercentage, setTipPercentage] = useState(0);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const gst = subtotal * 0.05;
  const tipAmount = subtotal * (tipPercentage / 100);
  const total = subtotal + gst + tipAmount;
  const splitAmount = total / splitCount;

  const handlePayment = () => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: cart,
      total: total,
      status: "pending",
      timestamp: new Date(),
      priority: Math.random() > 0.8 ? "high" : "normal", // Randomly assign high priority for demo
    };

    setOrderId(newOrder.id);
    setFinalTotal(total);
    setIsPaid(true);
    placeOrder(newOrder);
  };

  if (isPaid) {
    return (
      <div className="min-h-screen bg-[#FFFDD0] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-[#013220]/10">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold font-serif text-[#013220] mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Your order #{orderId.slice(-4)} has been sent to the kitchen.
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl text-left border border-gray-100 mb-8">
            <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              Digital Receipt
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Order ID:</span>{" "}
                <span className="font-mono">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span> <span>{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>{" "}
                <span className="uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-[#013220] pt-2 border-t border-gray-200 mt-2">
                <span>Total Paid:</span> <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-[#FF9933] text-white rounded-xl font-bold hover:bg-[#FF9933]/90 transition"
          >
            Start New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDD0] text-[#013220] p-4 md:p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#013220]/10 h-fit">
          <div className="p-6 border-b border-[#013220]/10 flex items-center gap-4">
            <button
              onClick={goBack}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold font-serif text-[#013220]">
              Order Summary
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span> <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span> <span>₹{gst.toFixed(2)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Tip ({tipPercentage}%)</span>{" "}
                  <span>₹{tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-[#FF9933] pt-4 border-t border-gray-200">
                <span>Total</span> <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Tip Selection */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h4 className="font-bold text-[#013220] mb-3 flex items-center gap-2">
                <Heart size={16} className="text-red-500" /> Add a Tip
              </h4>
              <div className="flex gap-2">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setTipPercentage(pct)}
                    className={`flex-1 py-2 rounded-xl border text-sm font-bold transition ${tipPercentage === pct ? "bg-[#FF9933] text-white border-[#FF9933]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                  >
                    {pct === 0 ? "No Tip" : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Bill */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h4 className="font-bold text-[#013220] mb-3 flex items-center gap-2">
                <Users size={16} className="text-blue-500" /> Split Bill
              </h4>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg w-4 text-center">
                    {splitCount}
                  </span>
                  <button
                    onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
                    className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                {splitCount > 1 && (
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">
                      Per Person
                    </span>
                    <span className="font-bold text-lg text-[#013220]">
                      ₹{splitAmount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle size={16} />
              </div>
              <div>
                <h4 className="font-bold text-blue-800 text-sm">
                  Estimated Prep Time: 15-20 mins
                </h4>
                <p className="text-xs text-blue-600 mt-1">
                  Based on current kitchen load.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#013220]/10 h-fit">
          <div className="p-6 border-b border-[#013220]/10">
            <h2 className="text-2xl font-bold font-serif text-[#013220]">
              Payment Method
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <label
              className={`flex items-center p-4 border rounded-2xl cursor-pointer transition ${paymentMethod === "upi" ? "border-[#FF9933] bg-[#FF9933]/5" : "border-gray-200 hover:bg-gray-50"}`}
            >
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
                className="mr-4 w-5 h-5 text-[#FF9933] focus:ring-[#FF9933]"
              />
              <Smartphone
                size={24}
                className={`mr-3 ${paymentMethod === "upi" ? "text-[#FF9933]" : "text-gray-400"}`}
              />
              <span className="font-medium text-lg">UPI (GPay, PhonePe)</span>
            </label>

            <label
              className={`flex items-center p-4 border rounded-2xl cursor-pointer transition ${paymentMethod === "card" ? "border-[#FF9933] bg-[#FF9933]/5" : "border-gray-200 hover:bg-gray-50"}`}
            >
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="mr-4 w-5 h-5 text-[#FF9933] focus:ring-[#FF9933]"
              />
              <CreditCard
                size={24}
                className={`mr-3 ${paymentMethod === "card" ? "text-[#FF9933]" : "text-gray-400"}`}
              />
              <span className="font-medium text-lg">Credit / Debit Card</span>
            </label>

            <label
              className={`flex items-center p-4 border rounded-2xl cursor-pointer transition ${paymentMethod === "cash" ? "border-[#FF9933] bg-[#FF9933]/5" : "border-gray-200 hover:bg-gray-50"}`}
            >
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                className="mr-4 w-5 h-5 text-[#FF9933] focus:ring-[#FF9933]"
              />
              <Banknote
                size={24}
                className={`mr-3 ${paymentMethod === "cash" ? "text-[#FF9933]" : "text-gray-400"}`}
              />
              <span className="font-medium text-lg">Cash at Counter</span>
            </label>

            <button
              onClick={handlePayment}
              className="w-full mt-8 py-4 bg-[#013220] text-white rounded-xl font-bold text-lg hover:bg-[#013220]/90 transition shadow-lg flex items-center justify-center gap-2"
            >
              Pay ₹{total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
