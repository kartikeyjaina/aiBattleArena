import React, { useState, useRef, useEffect } from "react";
import UserMessage from "./UserMessage";
import ArenaResponse from "./ArenaResponse";
import axios from "axios";

const MOCK_RESPONSE = {
  solution_1:
    "Here is a clean Python solution using modern syntax:\n\n```python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```\n\nThis approach has O(n) time complexity and O(1) space.",
  solution_2:
    "A recursive solution can be elegant but less efficient:\n\n```python\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n```\n\nNote: this has O(2^n) time complexity.",
  judge: {
    solution_1_score: 10,
    solution_2_score: 5,
    solution_1_reasoning:
      "Excellent, optimal solution. Space complexity is O(1) which is perfect for this problem.",
    solution_2_reasoning:
      "The recursive approach without memoization is extremely slow for large inputs.",
  },
};

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const quickPrompts = [
    "Design a caching strategy for a high-traffic API",
    "Refactor this React component for performance",
    "Compare two approaches for streaming data in Node.js",
  ];

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const problem = inputValue.trim();
    if (!problem || isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/invoke`, {
        input: problem,
      });

      const data = response.data;

      if (!data.success || !data.result) {
        throw new Error(data.message || "Backend did not return a result.");
      }

      const newMessage = {
        id: Date.now(),
        problem,
        ...data.result,
      };

      setMessages((currentMessages) => [...currentMessages, newMessage]);
      setInputValue("");
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to reach the backend.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-zinc-950 text-zinc-50 font-sans">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute left-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="animate-float-slower absolute right-[-4rem] top-[18%] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:84px_84px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_25%)]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/8 bg-zinc-950/72 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 shadow-[0_0_35px_rgba(168,85,247,0.25)]">
              <div className="h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_22px_rgba(168,85,247,0.95)]" />
              <span className="animate-pulse-ring absolute inset-0 rounded-2xl border border-violet-400/30" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-violet-200/70">
                Neural arena
              </p>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-50 md:text-xl">
                AI Chat Arena
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto px-4 pb-4 pt-4 md:px-8 md:pb-5 md:pt-5">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          {messages.length === 0 ? (
            <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="overflow-hidden rounded-[2.25rem] border border-white/8 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:p-8">
                <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-50 md:text-5xl">
                  Launch a sharper arena for code debates.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-zinc-300 md:text-[1.02rem]">
                  Drop in a problem and the arena will stage two answers, score
                  the tradeoffs, and keep the screen alive while the backend
                  thinks.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Dual solutions", "Side-by-side comparison"],
                    ["Judge scoring", "Transparent reasoning"],
                    ["Gemini, Mistral, Cohere", "Multiple model support"],
                  ].map(([title, detail]) => (
                    <div
                      key={title}
                      className="rounded-[1.4rem] border border-white/8 bg-white/5 p-4"
                    >
                      <p className="text-sm font-semibold text-zinc-50">
                        {title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-[2.25rem] border border-white/8 bg-zinc-950/72 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.38)] backdrop-blur-2xl md:p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
                    Quick prompts
                  </p>
                </div>
                <div className="space-y-3">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setInputValue(prompt)}
                      className="w-full rounded-[1.25rem] border border-white/8 bg-white/4 px-4 py-4 text-left text-sm leading-6 text-zinc-200 transition hover:border-violet-400/30 hover:bg-white/7 hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-200/70">
                Session feed
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
                Your latest arena rounds
              </h2>
            </div>
          )}

          {messages.length > 0 &&
            messages.map((msg) => (
              <div
                key={msg.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out"
              >
                <UserMessage message={msg.problem} />
                <ArenaResponse
                  solution1={msg.solution_1}
                  solution2={msg.solution_2}
                  judge={msg.judge}
                />
              </div>
            ))}

          {isLoading && (
            <section className="rounded-[2rem] border border-violet-400/20 bg-[linear-gradient(135deg,rgba(168,85,247,0.14),rgba(9,9,11,0.88))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-200/75">
                    Battle in progress
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-zinc-50">
                    The judge is composing the next round
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-300">
                    Two solutions are being generated and scored now. The
                    interface stays animated so the wait feels intentional.
                  </p>
                </div>
                
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  ["Solution 1", "Generating"],
                  ["Solution 2", "Generating"],
                ].map(([title, state], index) => (
                  <div
                    key={title}
                    className="rounded-[1.5rem] border border-white/8 bg-white/5 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                          {title}
                        </p>
                        <p className="mt-1 text-sm text-zinc-200">{state}</p>
                      </div>
                      <span
                        className={`h-3 w-3 rounded-full ${index === 0 ? "bg-violet-400" : "bg-cyan-400"} animate-pulse`}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 w-3/4 animate-shimmer rounded-full bg-gradient-to-r from-white/5 via-white/20 to-white/5" />
                      <div className="h-3 w-5/6 animate-shimmer rounded-full bg-gradient-to-r from-white/5 via-white/20 to-white/5" />
                      <div className="h-3 w-2/3 animate-shimmer rounded-full bg-gradient-to-r from-white/5 via-white/20 to-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div ref={endOfMessagesRef} />
        </div>
      </main>

      <div className="relative z-10 border-t border-white/8 bg-zinc-950/78 px-4 py-3 backdrop-blur-2xl md:px-8 md:py-4">
        <div className="mx-auto w-full max-w-6xl">
          <form
            onSubmit={handleSend}
            className="relative flex items-center gap-3 rounded-[1.75rem] border border-white/8 bg-white/5 p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.38)] backdrop-blur-2xl md:p-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask for an architectural duel, a refactor, or a tough coding decision..."
              className="w-full border-none bg-transparent py-3.5 pl-3.5 pr-2 text-[1rem] text-zinc-50 outline-none placeholder:text-zinc-500 focus:ring-0 md:py-4 md:pl-4"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.15rem] border border-violet-400/25 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_14px_40px_rgba(168,85,247,0.38)] transition duration-200 hover:scale-[1.02] hover:from-violet-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-45 md:h-14 md:w-14 md:rounded-[1.3rem]"
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              )}
            </button>
          </form>
          {error && <p className="mt-3 px-4 text-sm text-rose-300">{error}</p>}
        </div>
      </div>
    </div>
  );
}
