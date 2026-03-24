import React, { useState, useEffect, useRef } from "react";
import { MenuItem, CartItem, ChatMessage } from "../types";
import { menuItems } from "../data/menu";
import { getChatResponse, getMagicOrder } from "../services/gemini";
import {
  Send,
  Mic,
  Coffee,
  Leaf,
  Plus,
  Minus,
  ShoppingCart,
  Info,
  Camera,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Wand2,
  Filter,
} from "lucide-react";
import Markdown from "react-markdown";

interface CustomerViewProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  goToCart: () => void;
}

export default function CustomerView({
  cart,
  setCart,
  goToCart,
}: CustomerViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "model",
      text: "Welcome to ServeIQ. I am Anna, your AI waiter. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isTTSActive, setIsTTSActive] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isMagicOrderOpen, setIsMagicOrderOpen] = useState(false);
  const [magicOrderInput, setMagicOrderInput] = useState("");
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isPeakHour = new Date().getHours() >= 19 && new Date().getHours() <= 21;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const speakText = (text: string) => {
    if (!isTTSActive || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const responseText = await getChatResponse(
      [...messages, userMsg],
      userMsg.text,
    );
    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: responseText,
    };
    setMessages((prev) => [...prev, modelMsg]);
    setIsTyping(false);
    speakText(responseText);
  };

  const handleMagicOrder = async () => {
    if (!magicOrderInput.trim()) return;
    setIsMagicLoading(true);

    const result = await getMagicOrder(magicOrderInput, menuItems);

    if (result && result.items && result.items.length > 0) {
      // Add items to cart
      setCart((prev) => {
        const newCart = [...prev];
        result.items.forEach((magicItem) => {
          const menuItem = menuItems.find((m) => m.id === magicItem.id);
          if (menuItem) {
            const existing = newCart.find((i) => i.id === menuItem.id);
            if (existing) {
              existing.quantity += magicItem.quantity;
            } else {
              newCart.push({ ...menuItem, quantity: magicItem.quantity });
            }
          }
        });
        return newCart;
      });

      // Add Anna's message to chat
      const modelMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "model",
        text: `✨ **Magic Order Applied!** ✨\n\n${result.message}`,
      };
      setMessages((prev) => [...prev, modelMsg]);
      speakText(result.message);
      setIsMagicOrderOpen(false);
      setMagicOrderInput("");
    } else {
      const modelMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "model",
        text: `I'm sorry, I couldn't build a magic order for that request. Could you try rephrasing?`,
      };
      setMessages((prev) => [...prev, modelMsg]);
      setIsMagicOrderOpen(false);
    }

    setIsMagicLoading(false);
  };

  const handleSpeak = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i,
        );
      }
      return prev.filter((i) => i.id !== item.id);
    });
  };

  const handleMoodSelect = async (selectedMood: string) => {
    setMood(selectedMood);
    const promptText = `I am feeling ${selectedMood}. What do you recommend from the menu?`;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: promptText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const responseText = await getChatResponse(
      [...messages, userMsg],
      promptText,
    );
    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: responseText,
    };
    setMessages((prev) => [...prev, modelMsg]);
    setIsTyping(false);
    speakText(responseText);
  };

  const handleSuggestCombo = async (item: MenuItem) => {
    const promptText = `I'm interested in the ${item.name}. Can you suggest a smart combo to go with this?`;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: promptText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const responseText = await getChatResponse(
      [...messages, userMsg],
      promptText,
    );
    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: responseText,
    };
    setMessages((prev) => [...prev, modelMsg]);
    setIsTyping(false);
    speakText(responseText);
  };

  const openCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in your browser.");
      }

      // Request camera first before opening modal to avoid empty black box if denied
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraOpen(true);

      // Wait for modal to render and video element to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setIsCameraOpen(false);

      let errorMessage =
        "Could not access the camera. Please check your permissions.";
      if (
        err.name === "NotAllowedError" ||
        err.message.includes("Permission denied")
      ) {
        errorMessage =
          "Camera access was denied. Please allow camera access in your browser's site settings or your operating system's privacy settings, then try again.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "No camera device was found on your system.";
      }

      alert(errorMessage);
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");

        closeCamera();

        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: "user",
          text: "I am using visual assist. Please interpret this image to help me order.",
          imageUrl: imageDataUrl,
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        const responseText = await getChatResponse(
          [...messages, userMsg],
          userMsg.text,
          imageDataUrl,
        );
        const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: responseText,
        };
        setMessages((prev) => [...prev, modelMsg]);
        setIsTyping(false);
        speakText(responseText);
      }
    }
  };

  const allCategories = Array.from(
    new Set(menuItems.map((item) => item.category)),
  );
  const filteredMenu =
    activeFilter === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeFilter);

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[#FFFDD0] text-[#013220]">
      {/* Menu Sidebar */}
      <div className="w-full md:w-1/2 lg:w-3/5 p-4 overflow-y-auto border-r border-[#013220]/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold font-serif text-[#FF9933]">
            Our Menu
          </h2>
          <button
            onClick={goToCart}
            className="relative p-2 bg-[#013220] text-white rounded-full hover:bg-[#013220]/80 transition"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF9933] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Mood Selector & Filters */}
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-white rounded-xl shadow-sm border border-[#013220]/10">
            <h3 className="text-sm font-semibold mb-2 text-gray-600 uppercase tracking-wider">
              How are you feeling?
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["Happy 😄", "Stressed 😵", "Diet 🥗"].map((m) => (
                <button
                  key={m}
                  onClick={() => handleMoodSelect(m)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap shrink-0 ${mood === m ? "bg-[#FF9933] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-sm border border-[#013220]/10 text-center">
            <h3 className="text-sm font-semibold mb-3 text-gray-600 uppercase tracking-wider flex items-center justify-center gap-2">
              <Filter size={14} /> Categories
            </h3>
            <div className="flex justify-center">
              <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => setActiveFilter("All")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap shrink-0 ${activeFilter === "All" ? "bg-[#013220] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  All
                </button>
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap shrink-0 ${activeFilter === category ? "bg-[#013220] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {allCategories
            .filter(
              (category) => activeFilter === "All" || category === activeFilter,
            )
            .map((category) => {
              const categoryItems = filteredMenu.filter(
                (item) => item.category === category,
              );
              if (categoryItems.length === 0) return null;

              return (
                <div key={category} className="mb-2">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold font-serif text-[#013220] mb-4 border-b-2 border-[#FF9933]/30 pb-2 inline-block">
                      {category}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden border border-[#013220]/10 hover:border-[#FF9933]/50 flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      >
                        {isPeakHour && (
                          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 text-center">
                            Peak Hour Pricing
                          </div>
                        )}
                        <div className="p-4 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold">{item.name}</h3>
                            <span className="font-bold text-[#FF9933]">
                              ₹{isPeakHour ? item.price + 20 : item.price}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 flex-grow">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 flex items-center gap-1">
                              <Info size={12} /> {item.calories} kcal
                            </span>
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-[#013220]/10 text-[#013220] px-2 py-1 rounded-full flex items-center gap-1"
                              >
                                {tag === "Vegetarian" || tag === "Healthy" ? (
                                  <Leaf size={12} />
                                ) : null}
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2 w-full mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSuggestCombo(item);
                              }}
                              className="p-2 bg-[#FF9933]/20 text-[#FF9933] rounded-xl hover:bg-[#FF9933]/30 transition flex items-center justify-center shrink-0"
                              title="Suggest Combo"
                              aria-label={`Suggest a combo for ${item.name}`}
                            >
                              <Sparkles size={18} />
                            </button>
                            {cart.find((i) => i.id === item.id) ? (
                              <div className="flex-1 flex items-center justify-between bg-[#013220] text-white rounded-xl overflow-hidden font-medium">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(item);
                                  }}
                                  className="p-2 hover:bg-[#013220]/80 transition flex-1 flex justify-center"
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="px-4 py-2 bg-[#013220]/90">
                                  {cart.find((i) => i.id === item.id)?.quantity}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(item);
                                  }}
                                  className="p-2 hover:bg-[#013220]/80 transition flex-1 flex justify-center"
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(item);
                                }}
                                className="flex-1 py-2 bg-[#013220] text-white rounded-xl font-medium hover:bg-[#013220]/90 transition flex items-center justify-center gap-2"
                              >
                                <Plus size={18} /> Add to Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col h-[50vh] md:h-full border-l border-[#013220]/20 bg-white">
        <div className="p-4 bg-[#013220] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF9933] flex items-center justify-center font-bold text-xl">
              A
            </div>
            <div>
              <h2 className="font-bold">Anna</h2>
              <p className="text-xs text-white/80">AI Waiter • Online</p>
            </div>
          </div>
          <button
            onClick={() => setIsTTSActive(!isTTSActive)}
            className={`p-2 rounded-full transition ${isTTSActive ? "bg-[#FF9933] text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
            aria-label={
              isTTSActive ? "Disable voice assist" : "Enable voice assist"
            }
            title={isTTSActive ? "Disable voice assist" : "Enable voice assist"}
          >
            {isTTSActive ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${msg.role === "user" ? "bg-[#FF9933] text-white rounded-tr-none" : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none"}`}
              >
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="User visual input"
                    className="w-full rounded-xl mb-2 object-cover"
                  />
                )}
                <div className="markdown-body text-sm">
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
          <button
            onClick={() => setIsMagicOrderOpen(true)}
            aria-label="AI Magic Order"
            title="AI Magic Order"
            className="p-3 rounded-full transition bg-purple-100 text-purple-600 hover:bg-purple-200"
          >
            <Wand2 size={20} />
          </button>
          <button
            onClick={openCamera}
            aria-label="Visual assist camera"
            title="Visual assist camera"
            className="p-3 rounded-full transition bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Camera size={20} />
          </button>
          <button
            onClick={handleSpeak}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            className={`p-3 rounded-full transition ${isListening ? "bg-red-100 text-red-500 animate-pulse" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Anna for recommendations..."
            aria-label="Chat message input"
            className="flex-grow bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50 w-0"
          />
          <button
            onClick={handleSend}
            aria-label="Send message"
            className="p-3 bg-[#013220] text-white rounded-full hover:bg-[#013220]/90 transition shrink-0"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Magic Order Modal */}
      {isMagicOrderOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl flex flex-col">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-[#FF9933] text-white flex justify-between items-center">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <Wand2 /> AI Magic Order
              </h3>
              <button
                onClick={() => setIsMagicOrderOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Tell Anna what you're craving, your budget, or your dietary
                goals, and she will instantly build the perfect cart for you!
              </p>
              <textarea
                value={magicOrderInput}
                onChange={(e) => setMagicOrderInput(e.target.value)}
                placeholder="e.g., 'I want a high protein meal under ₹300' or 'I am super hungry and love spicy food!'"
                className="w-full border border-gray-200 rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-4"
              />
              <button
                onClick={handleMagicOrder}
                disabled={isMagicLoading || !magicOrderInput.trim()}
                className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition ${isMagicLoading || !magicOrderInput.trim() ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg"}`}
              >
                {isMagicLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Building your cart...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> Build My Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden max-w-md w-full shadow-2xl flex flex-col">
            <div className="p-4 bg-[#013220] text-white flex justify-between items-center">
              <h3 className="font-bold">Visual Assist</h3>
              <button
                onClick={closeCamera}
                className="p-1 hover:bg-white/20 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative bg-black aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="p-4 bg-gray-50 flex justify-center">
              <button
                onClick={captureImage}
                className="px-6 py-3 bg-[#FF9933] text-white font-bold rounded-full hover:bg-[#FF9933]/90 transition flex items-center gap-2"
              >
                <Camera size={20} /> Capture & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
