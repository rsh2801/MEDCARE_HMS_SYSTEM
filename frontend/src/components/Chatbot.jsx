import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hello! I'm MedCare AI, your medical triage assistant. Describe your symptoms and I'll help guide you to the right department.",
  department: null,
  urgency: null,
};

const URGENCY_VARIANT = {
  urgent: "destructive",
  soon: "warning",
  routine: "default",
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build history from existing messages (exclude welcome message's non-chat fields)
      const history = [...messages, userMessage]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      while (history.length > 0 && history[0].role === "assistant") {
        history.shift();
      }

      const { data } = await axios.post(
        "http://localhost:5000/api/v1/chatbot/ask",
        { message: trimmed, history }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          department: data.suggestedDepartment,
          urgency: data.urgency,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          department: null,
          urgency: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBookAppointment = (department) => {
    navigate(`/appointment?department=${encodeURIComponent(department)}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Open symptom checker"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 inset-x-0 bottom-14 top-16 lg:inset-auto lg:bottom-6 lg:right-6 lg:w-[400px] lg:h-[600px] lg:rounded-2xl flex flex-col bg-white dark:bg-slate-900 lg:shadow-2xl lg:border lg:border-slate-200 dark:lg:border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">MedCare AI</p>
                  <p className="text-xs text-teal-100">Symptom Checker</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] space-y-2 ${
                      msg.role === "user" ? "order-first" : ""
                    }`}
                  >
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-teal-500 text-white rounded-br-md"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Urgency badge */}
                    {msg.urgency && (
                      <Badge variant={URGENCY_VARIANT[msg.urgency] || "default"}>
                        {msg.urgency === "urgent"
                          ? "Urgent"
                          : msg.urgency === "soon"
                          ? "See doctor soon"
                          : "Routine"}
                      </Badge>
                    )}

                    {/* Department booking button */}
                    {msg.department && (
                      <button
                        onClick={() => handleBookAppointment(msg.department)}
                        className="block w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors cursor-pointer"
                      >
                        Book {msg.department} Appointment &rarr;
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-slate-100 dark:bg-slate-800">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your symptoms..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border-0 outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 dark:disabled:text-slate-500 flex items-center justify-center transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
