import React from "react";
import { Utensils, ChefHat, BarChart3 } from "lucide-react";

interface LandingViewProps {
  onNavigate: (view: "customer" | "kitchen" | "admin") => void;
}

export default function LandingView({ onNavigate }: LandingViewProps) {
  return (
    <div className="h-full w-full bg-[#FFFDD0] flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-5xl w-full text-center space-y-8 py-12">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-6xl md:text-8xl font-black font-serif text-[#013220] tracking-tighter">
            Serve<span className="text-[#FF9933]">IQ</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto">
            The intelligent restaurant management platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          {/* Customer Portal */}
          <button
            onClick={() => onNavigate("customer")}
            className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl border border-[#013220]/10 hover:border-[#FF9933]/50 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center gap-6 text-center"
          >
            <div className="w-24 h-24 bg-[#FF9933]/10 text-[#FF9933] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Utensils size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#013220] mb-2">
                Order Food
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Browse the menu and place orders with our intelligent AI
                assistant.
              </p>
            </div>
          </button>

          {/* Kitchen Portal */}
          <button
            onClick={() => onNavigate("kitchen")}
            className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl border border-[#013220]/10 hover:border-[#FF9933]/50 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center gap-6 text-center"
          >
            <div className="w-24 h-24 bg-[#013220]/10 text-[#013220] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ChefHat size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#013220] mb-2">
                Kitchen Display
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Manage incoming orders and update preparation status in
                real-time.
              </p>
            </div>
          </button>

          {/* Admin Portal */}
          <button
            onClick={() => onNavigate("admin")}
            className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl border border-[#013220]/10 hover:border-[#FF9933]/50 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center gap-6 text-center"
          >
            <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BarChart3 size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#013220] mb-2">
                Admin Dashboard
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                View analytics, revenue, and AI-driven insights for your
                restaurant.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
