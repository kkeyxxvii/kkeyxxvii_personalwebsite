"use client";

/**
 * ChatPanel — slides in from the RIGHT, fixed to the viewport.
 *
 * Desktop (md+): pure push layout — no backdrop, content shifts via ShiftLayout.
 * Mobile  (<md): full-screen overlay with a dimming backdrop.
 *
 * Total width: 420 px main + 40 px decorative sidebar = 460 px
 * (matches PANEL_WIDTH in ShiftLayout.tsx)
 */

import { useEffect, useRef, useState } from "react";
import { useChatContext } from "./ChatContext";

type Message = { role: "user" | "assistant"; content: string };

const STARTER_QUESTIONS = [
  "What's your favorite project and why?",
  "How do you approach product design strategy?",
  "Tell me about your experience at Genea",
];

/* ── Icon helpers ────────────────────────────────── */
const IconInfo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
  </svg>
);
const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
  </svg>
);
const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconSend = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6.5 13L7.28446 14.5689C7.54995 15.0999 7.68269 15.3654 7.86003 15.5954C8.01739 15.7996 8.20041 15.9826 8.40455 16.14C8.63462 16.3173 8.9001 16.4501 9.43108 16.7155L11 17.5L9.43108 18.2845C8.9001 18.5499 8.63462 18.6827 8.40455 18.86C8.20041 19.0174 7.86003 19.4046 7.86003 19.4046C7.68269 19.6346 7.54995 19.9001 7.28446 20.4311L6.5 22L5.71554 20.4311C5.45005 19.9001 5.31731 19.6346 5.13997 19.4046C4.98261 19.2004 4.79959 19.0174 4.59545 18.86C4.36538 18.6827 4.0999 18.5499 3.56892 18.2845L2 17.5L3.56892 16.7155C4.0999 16.4501 4.36538 16.3173 4.59545 16.14C4.79959 15.9826 4.98261 15.7996 5.13997 15.5954C5.31731 15.3654 5.45005 15.0999 5.71554 14.5689L6.5 13Z" stroke="#FF2929" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 2L16.1786 5.06442C16.4606 5.79765 16.6016 6.16426 16.8209 6.47264C17.0153 6.74595 17.254 6.98475 17.5274 7.17909C17.8357 7.39836 18.2024 7.53937 18.9356 7.82138L22 9L18.9356 10.1786C18.2024 10.4606 17.8357 10.6016 17.5274 10.8209C17.254 11.0153 17.0153 11.254 16.8209 11.5274C16.6016 11.8357 16.4606 12.2024 16.1786 12.9356L15 16L13.8214 12.9356C13.5394 12.2024 13.3984 11.8357 13.1791 11.5274C12.9847 11.254 12.746 11.0153 12.4726 10.8209C12.1643 10.6016 11.7976 10.4606 11.0644 10.1786L8 9L11.0644 7.82138C11.7976 7.53937 12.1643 7.39836 12.4726 7.17909C12.746 6.98475 12.9847 6.74595 13.1791 6.47264C13.3984 6.16426 13.5394 5.79765 13.8214 5.06442L15 2Z" stroke="#FF2929" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Typing animation ────────────────────────────── */
function TypingDots() {
  return (
    <span className="inline-flex gap-1 items-center py-1">
      {["-0.32s", "-0.16s", "0s"].map((d, i) => (
        <span key={i} className="w-1.5 h-1.5 bg-[#c0c0c8] rounded-full animate-bounce" style={{ animationDelay: d }} />
      ))}
    </span>
  );
}

const EASE = "cubic-bezier(0.72, 0, 0.28, 1)";

export default function ChatPanel() {
  const { open, closeChat } = useChatContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  /* Detect desktop */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Auto-focus input on open */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 420);
  }, [open]);

  /* Scroll to latest message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setMessages([...next, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const snap = accumulated;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: snap };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Sorry, something went wrong. Please try again." };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  /* ── Transition values ─────────────────────────── */
  const panelTranslate = open ? "translateX(0)" : "translateX(100%)";
  const transition     = `transform 0.4s ${EASE}`;

  return (
    <>
      {/* ── Mobile backdrop only — desktop uses push layout ── */}
      {!isDesktop && (
        <div
          onClick={closeChat}
          aria-hidden="true"
          style={{
            position:   "fixed",
            inset:      0,
            zIndex:     90,
            background: open ? "rgba(0,0,0,0.18)" : "transparent",
            backdropFilter: open ? "blur(16px) saturate(160%)" : "none",
            WebkitBackdropFilter: open ? "blur(16px) saturate(160%)" : "none",
            pointerEvents: open ? "auto" : "none",
            transition: `background 0.4s ${EASE}, backdrop-filter 0.4s ${EASE}`,
          }}
        />
      )}

      {/* ── Panel — fixed to right viewport edge ─────────── */}
      <div
        role="dialog"
        aria-label="KKEYXXVIIAI chat"
        aria-modal="true"
        style={{
          position:   "fixed",
          top:        0,
          right:      0,
          height:     "100%",
          zIndex:     100,
          display:    "flex",
          transform:  panelTranslate,
          transition,
          willChange: "transform",
        }}
      >
        {/* ── Main panel body ───────────────────────────── */}
        <div className="w-[420px] max-w-[calc(100vw-40px)] flex flex-col h-full" style={{
          background: "rgba(246,246,246,0.88)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderLeft: "0.5px solid rgba(24,22,23,0.08)",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.06)",
        } as React.CSSProperties}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "0.5px solid rgba(24,22,23,0.08)" }}>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold tracking-[0.22em] uppercase text-[#181617]">
                KKEYXXVIIAI
              </span>
              <button title="AI that knows everything about Kartikey" className="text-[#b0b0b8] hover:text-[#6b7280] transition-colors" tabIndex={-1}>
                <IconInfo />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setMessages([]); setInput(""); }}
                title="Clear conversation"
                className="text-[#b0b0b8] hover:text-[#6b7280] transition-colors cursor-pointer"
              >
                <IconRefresh />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col justify-end h-full pb-2">
                <p className="text-[1.6rem] font-light text-[#181617] leading-snug mb-6">
                  Hey, ask away.
                </p>
                <div className="flex flex-col gap-3">
                  {STARTER_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="flex items-start gap-2 text-left text-[13px] text-[#9ca3af] hover:text-[#6b7280] transition-colors group cursor-pointer"
                    >
                      <span className="mt-0.5 shrink-0 text-[#c0c0c8]">↳</span>
                      <span className="group-hover:underline underline-offset-2 leading-snug">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                        msg.role === "user" ? "text-white" : "text-[#4a4a5a]"
                      }`}
                      style={msg.role === "user"
                        ? { background: "linear-gradient(135deg, #FF2929, #FFD029)", boxShadow: "0 4px 14px rgba(255,41,41,0.25)" }
                        : { background: "rgba(255,255,255,0.82)", backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)", border: "0.5px solid rgba(24,22,23,0.07)", boxShadow: "0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)" }
                      }
                    >
                      {msg.content ? msg.content : <TypingDots />}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="px-4 pb-5 pt-2" style={{ background: "transparent" }}>
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex items-center gap-2 rounded-xl px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                border: "0.5px solid rgba(24,22,23,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
              } as React.CSSProperties}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Kartikey..."
                disabled={loading}
                className="flex-1 text-[13px] text-[#181617] placeholder-[#c0c0c8] bg-transparent outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-25 transition-opacity shrink-0 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #FF2929, #FFD029)" }}
              >
                <IconSend />
              </button>
            </form>
          </div>
        </div>

      </div>
    </>
  );
}
