import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<{ role: "user" | "model"; parts: { text: string }[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions = [
    "How to apply for a job?",
    "How to post a job?",
    "Where is the headquarters?",
    "Contact information"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setLoading(true);
    setHistory(prev => [...prev, { role: "user", parts: [{ text }] }]);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history })
      });
      const data = await response.json();
      setHistory(prev => [...prev, { role: "model", parts: [{ text: data.text }] }]);
    } catch (error) {
      setHistory(prev => [...prev, { role: "model", parts: [{ text: "Sorry, I encountered an error. Please try again or contact support." }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-corporate-blue text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-purple-glow/20 flex items-center justify-center border border-white/20">
                  <Bot className="w-6 h-6 text-purple-glow" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">JobUstad Agent</h3>
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Online Assistance</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6">
              {history.length === 0 && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm italic">Hello! How can I assist you with your career journey today?</p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="text-xs font-bold text-corporate-blue bg-corporate-blue/5 hover:bg-corporate-blue hover:text-white px-3 py-2 rounded-full border border-corporate-blue/10 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === "user" ? "bg-corporate-blue text-white" : "bg-gray-100 text-gray-800"}`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-2xl">
                    <Loader2 className="w-5 h-5 animate-spin text-corporate-accent" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend(message)}
                placeholder="Type your message..."
                className="flex-grow text-sm focus:outline-none px-4 py-2 bg-gray-50 rounded-xl"
              />
              <button
                onClick={() => handleSend(message)}
                disabled={loading || !message.trim()}
                className="p-3 bg-corporate-blue text-white rounded-xl hover:bg-purple-tech transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-brand-start to-brand-end rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer ring-4 ring-white hover:scale-110 transition-transform"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
