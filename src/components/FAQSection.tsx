"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const defaultFAQs: FAQItem[] = [
  {
    question: "How do I book an activity?",
    answer:
      "Select an activity, choose your preferred date and number of guests, then follow the checkout flow to complete your booking.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Most activities allow free cancellation up to 24 hours before the start time. Specific policies are listed on each activity's page.",
  },
  {
    question: "Are activities suitable for children or seniors?",
    answer:
      "Activity suitability varies. Each listing includes an accessibility/suitability note — contact us if you need specific guidance.",
  },
  {
    question: "How do I request a custom itinerary or group booking?",
    answer:
      "For group bookings or custom itineraries, contact our support team with your dates and requirements and we'll assist with a tailored plan.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards and popular digital wallets. Payment options appear during checkout and may vary by provider.",
  },
];

type Message = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  kind?: "text" | "typing";
};

function uid() {
  // safe-ish unique id
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function FAQSection({ items }: { items?: FAQItem[] }) {
  const faqItems = items ?? defaultFAQs;

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: uid(),
      role: "assistant",
      kind: "text",
      text: "Hey 👋 Ask me anything about bookings, cancellations, payments, or group trips.",
    },
    {
      id: uid(),
      role: "assistant",
      kind: "text",
      text: "Pick a question below and I’ll answer like a normal human (promise).",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const askedQuestions = useMemo(() => {
    const asked = new Set<string>();
    for (const m of messages) {
      if (m.role === "user" && m.text) asked.add(m.text);
    }
    return asked;
  }, [messages]);

  useEffect(() => {
    if (containerRef.current) {
      try {
        containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
      } catch {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  const clearChat = () => {
    setIsTyping(false);
    setMessages([
      {
        id: uid(),
        role: "assistant",
        kind: "text",
        text: "Reset ✅ Ask another one — I’m here.",
      },
    ]);
  };

  const ask = (item: FAQItem) => {
    if (isTyping) return;

    setIsTyping(true);

    const typingId = uid();

    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: item.question },
      { id: typingId, role: "assistant", kind: "typing" },
    ]);

    // “typing…” delay (feels conversational)
    window.setTimeout(() => {
      setMessages((prev) => {
        // remove typing bubble, then append answer
        const withoutTyping = prev.filter((m) => m.id !== typingId);
        return [
          ...withoutTyping,
          { id: uid(), role: "assistant", kind: "text", text: item.answer },
        ];
      });
      setIsTyping(false);
    }, 650);
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">
            FAQ, but like a conversation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tap a question → it drops into chat → you get an instant answer.
          </p>
        </div>

        {/* Chat card */}
        <div className="rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-black/5 bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold">
                ?
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-gray-900 leading-tight">Support</p>
                <p className="text-xs text-gray-500 leading-tight">
                  Usually replies instantly
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearChat}
              className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-50 hover:bg-slate-100 text-slate-900 ring-1 ring-black/5"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div ref={containerRef} className="px-5 py-5 max-h-[520px] overflow-y-auto bg-gradient-to-b from-white to-slate-50">
            <div className="space-y-4">
              {messages.map((m) => {
                const isUser = m.role === "user";

                return (
                  <div
                    key={m.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={[
                        "max-w-[85%] md:max-w-[72%] rounded-3xl px-4 py-3 shadow-sm ring-1",
                        isUser
                          ? "bg-slate-900 text-white ring-black/5 rounded-br-lg"
                          : "bg-white text-slate-800 ring-black/5 rounded-bl-lg",
                      ].join(" ")}
                    >
                      {m.kind === "typing" ? (
                        <div className="flex items-center gap-1 py-1">
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse [animation-delay:120ms]" />
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse [animation-delay:240ms]" />
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {m.text}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Quick questions */}
          <div className="border-t border-black/5 bg-white px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-gray-900">Quick questions</p>
              <p className="text-xs text-gray-500">
                {isTyping ? "Answering…" : "Tap to ask"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {faqItems.map((item, idx) => {
                const disabled = isTyping; // keep it simple
                const alreadyAsked = askedQuestions.has(item.question);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => ask(item)}
                    disabled={disabled}
                    className={[
                      "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                      "ring-1 ring-black/10",
                      disabled
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : alreadyAsked
                        ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        : "bg-white text-slate-900 hover:bg-slate-50 hover:-translate-y-[1px] hover:shadow-md",
                    ].join(" ")}
                    aria-label={`Ask: ${item.question}`}
                    title={item.question}
                  >
                    {item.question}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Tip: You can keep asking multiple questions — it remembers the thread.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
