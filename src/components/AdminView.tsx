import React, { useState, useEffect } from "react";
import { Order } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Star,
} from "lucide-react";

interface AdminViewProps {
  orders: Order[];
  totalRevenue: number;
}

export default function AdminView({ orders }: AdminViewProps) {
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const [isDynamicPricingActive, setIsDynamicPricingActive] = useState(true);
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "rating-desc" | "rating-asc"
  >("date-desc");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const mockSalesData = [
    { time: "10:00", sales: 400 },
    { time: "12:00", sales: 1200 },
    { time: "14:00", sales: 800 },
    { time: "16:00", sales: 600 },
    { time: "18:00", sales: 1500 },
    { time: "20:00", sales: 2500 },
  ];

  const mockWasteData = [
    { day: "Mon", waste: 12 },
    { day: "Tue", waste: 8 },
    { day: "Wed", waste: 15 },
    { day: "Thu", waste: 5 },
    { day: "Fri", waste: 20 },
    { day: "Sat", waste: 25 },
  ];

  const dynamicPricingItems = [
    {
      name: "Masala Dosa",
      basePrice: 120,
      currentPrice: 140,
      demand: "High",
      trend: "up",
    },
    {
      name: "Filter Coffee",
      basePrice: 40,
      currentPrice: 50,
      demand: "High",
      trend: "up",
    },
    {
      name: "Idli Sambar",
      basePrice: 60,
      currentPrice: 50,
      demand: "Low",
      trend: "down",
    },
  ];

  const mockReviews = [
    {
      id: 1,
      customerName: "Rahul S.",
      rating: 5,
      date: "2026-03-22",
      comment:
        "Absolutely loved the Masala Dosa! The AI recommendations were spot on.",
      sentiment: "Positive",
    },
    {
      id: 2,
      customerName: "Priya K.",
      rating: 4,
      date: "2026-03-21",
      comment: "Great food, but the service was a bit slow during peak hours.",
      sentiment: "Neutral",
    },
    {
      id: 3,
      customerName: "Amit V.",
      rating: 2,
      date: "2026-03-20",
      comment: "The Idli was cold when it arrived. Disappointed.",
      sentiment: "Negative",
    },
    {
      id: 4,
      customerName: "Sneha R.",
      rating: 5,
      date: "2026-03-23",
      comment: "Best Filter Coffee in town! Will definitely visit again.",
      sentiment: "Positive",
    },
    {
      id: 5,
      customerName: "Vikram M.",
      rating: 3,
      date: "2026-03-19",
      comment: "Average experience. The ambiance is nice though.",
      sentiment: "Neutral",
    },
  ];

  const filteredAndSortedReviews = mockReviews
    .filter(
      (review) => filterRating === "all" || review.rating === filterRating,
    )
    .sort((a, b) => {
      if (sortBy === "date-desc")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "date-asc")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "rating-desc") return b.rating - a.rating;
      if (sortBy === "rating-asc") return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium">
            {currentTime.toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            | {currentTime.toLocaleTimeString("en-IN")}
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
            <Activity size={18} className="text-blue-500" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">
              Total Revenue
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              ₹
              {totalRevenue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
          </div>
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">
              Total Orders
            </p>
            <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">
              Active Tables
            </p>
            <h3 className="text-2xl font-bold text-gray-900">8 / 15</h3>
          </div>
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">AI Alerts</p>
            <h3 className="text-2xl font-bold text-red-600">2</h3>
          </div>
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 text-gray-800">
            Sales Trend (Today)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSalesData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#3b82f6",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Zap className="text-yellow-500" size={20} /> Dynamic Pricing
            </h3>
            <button
              onClick={() => setIsDynamicPricingActive(!isDynamicPricingActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDynamicPricingActive ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDynamicPricingActive ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>

          <div className="space-y-4">
            {dynamicPricingItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Base: ₹{item.basePrice}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="font-bold text-lg">
                      ₹{item.currentPrice}
                    </span>
                    {item.trend === "up" ? (
                      <ArrowUpRight size={16} className="text-green-500" />
                    ) : (
                      <ArrowDownRight size={16} className="text-red-500" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.demand === "High" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    {item.demand} Demand
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            AI adjusts prices automatically based on real-time demand and
            inventory.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Smart Table Management
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => {
              const status =
                i % 5 === 0 ? "reserved" : i % 3 === 0 ? "occupied" : "empty";
              const colors = {
                empty: "bg-green-100 text-green-700 border-green-200",
                occupied: "bg-red-100 text-red-700 border-red-200",
                reserved: "bg-yellow-100 text-yellow-700 border-yellow-200",
              };
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${colors[status]} flex flex-col items-center justify-center`}
                >
                  <span className="font-bold text-lg mb-1">T-{i + 1}</span>
                  <span className="text-xs uppercase font-semibold tracking-wider">
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800">
            AI Food Waste Prediction (kg)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWasteData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af" }}
                />
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="waste" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Smart Inventory (AI Predicted)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="pb-3 font-medium">Ingredient</th>
                  <th className="pb-3 font-medium">Current Stock</th>
                  <th className="pb-3 font-medium">
                    Predicted Usage (Next 24h)
                  </th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="py-4 font-medium text-gray-900">
                    Rice Batter
                  </td>
                  <td className="py-4">15 kg</td>
                  <td className="py-4 text-red-600 font-bold">18 kg</td>
                  <td className="py-4">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                      Reorder Needed
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 font-medium text-gray-900">
                    Coffee Beans
                  </td>
                  <td className="py-4">5 kg</td>
                  <td className="py-4">2 kg</td>
                  <td className="py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                      Sufficient
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-900">Onions</td>
                  <td className="py-4">8 kg</td>
                  <td className="py-4 text-yellow-600 font-bold">7.5 kg</td>
                  <td className="py-4">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                      Low Stock
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Real-time AI Alerts
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3">
              <AlertTriangle className="text-red-500 shrink-0" />
              <div>
                <h4 className="font-bold text-red-800 text-sm">
                  High Food Waste Detected
                </h4>
                <p className="text-xs text-red-600 mt-1">
                  Rice waste is 20% higher than usual today. Adjust batch size.
                </p>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex gap-3">
              <AlertTriangle className="text-yellow-500 shrink-0" />
              <div>
                <h4 className="font-bold text-yellow-800 text-sm">
                  Slow Kitchen Performance
                </h4>
                <p className="text-xs text-yellow-600 mt-1">
                  Average prep time for Dosa is exceeding 15 mins.
                </p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
              <Activity className="text-blue-500 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-800 text-sm">
                  Demand Forecast
                </h4>
                <p className="text-xs text-blue-600 mt-1">
                  Expect 30% surge in orders between 7 PM - 9 PM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Customer Sentiment (AI Analyzed)
          </h3>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full border-8 border-green-400 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">85%</span>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Positive Sentiment</p>
              <p className="text-sm text-gray-400 mt-1">
                Based on 120 recent reviews and chat interactions.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Food Quality</span>
              <div className="w-1/2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Service Speed</span>
              <div className="w-1/2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Ambiance</span>
              <div className="w-1/2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            AI Menu Recommendations
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div>
                <p className="font-bold text-gray-800">
                  Introduce "Mango Lassi"
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  High search volume for cold beverages. Expected revenue
                  increase: 5%.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div>
                <p className="font-bold text-gray-800">Bundle "Idli + Vada"</p>
                <p className="text-sm text-gray-500 mt-1">
                  Frequently ordered together. Create a combo to increase
                  average order value.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div>
                <p className="font-bold text-gray-800">Reduce "Upma" Prep</p>
                <p className="text-sm text-gray-500 mt-1">
                  Consistently low demand on Tuesdays. Reduce batch size to
                  minimize waste.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg font-bold text-gray-800">
            User Reviews & Ratings
          </h3>
          <div className="flex flex-wrap gap-4">
            <select
              value={filterRating}
              onChange={(e) =>
                setFilterRating(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="rating-desc">Highest Rating</option>
              <option value="rating-asc">Lowest Rating</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAndSortedReviews.map((review) => (
            <div
              key={review.id}
              className="p-5 border border-gray-100 rounded-xl bg-gray-50 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-gray-900">
                  {review.customerName}
                </span>
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-700">
                    {review.rating}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 flex-grow leading-relaxed">
                "{review.comment}"
              </p>
              <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-400 font-medium">
                  {new Date(review.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    review.sentiment === "Positive"
                      ? "bg-green-100 text-green-700"
                      : review.sentiment === "Negative"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {review.sentiment}
                </span>
              </div>
            </div>
          ))}
          {filteredAndSortedReviews.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No reviews found matching the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
