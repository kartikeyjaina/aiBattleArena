import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

function MarkdownBlock({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1
            className="mb-4 mt-6 text-2xl font-bold text-[#f4f1ea]"
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            className="mb-3 mt-5 text-xl font-bold text-[#f4f1ea]"
            {...props}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3
            className="mb-2 mt-4 text-lg font-bold text-[#f4f1ea]"
            {...props}
          />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-4 leading-7 text-zinc-300" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul
            className="mb-4 list-disc space-y-1 pl-6 text-zinc-300"
            {...props}
          />
        ),
        ol: ({ node, ...props }) => (
          <ol
            className="mb-4 list-decimal space-y-1 pl-6 text-zinc-300"
            {...props}
          />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-violet-300 underline decoration-violet-400/40 underline-offset-4 hover:text-violet-200"
            {...props}
          />
        ),
        code: ({ node, inline, className, children, ...props }) =>
          !inline ? (
            <div className="my-4 overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
              <pre className="overflow-x-auto p-4 text-sm text-[#f4f1ea]">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          ) : (
            <code
              className="rounded-md border border-violet-400/20 bg-violet-500/10 px-1.5 py-0.5 font-mono text-sm text-violet-100"
              {...props}
            >
              {children}
            </code>
          ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function ScoreMeter({ label, score, tone = "violet" }) {
  const width = Math.max(0, Math.min(100, (score / 10) * 100));
  const accent = tone === "violet" ? "bg-violet-300" : "bg-cyan-300";
  const glow =
    tone === "violet"
      ? "shadow-[0_0_22px_rgba(196,181,253,0.5)]"
      : "shadow-[0_0_22px_rgba(103,232,249,0.45)]";
  const scoreTone =
    score >= 8
      ? "Strong"
      : score >= 6
        ? "Solid"
        : score >= 4
          ? "Mixed"
          : "Weak";

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-200">{label}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">
            {scoreTone} answer
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm font-semibold text-zinc-50">
          {score}
          <span className="ml-0.5 text-zinc-500">/10</span>
        </div>
      </div>

      <div className="relative h-1.5 rounded-full bg-white/[0.07]">
        <div
          className={`h-full rounded-full ${accent} ${glow}`}
          style={{ width: `${width}%` }}
        />
        <div className="pointer-events-none absolute inset-0 grid grid-cols-5">
          {[0, 1, 2, 3, 4].map((tick) => (
            <span
              key={tick}
              className="border-r border-black/50 last:border-r-0"
            />
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-medium text-zinc-600">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
}

export default function ArenaResponse({ solution1, solution2, judge }) {
  useEffect(() => {
    hljs.highlightAll();
  }, [solution1, solution2]);

  const solution1Score = judge?.solution_1_score ?? 0;
  const solution2Score = judge?.solution_2_score ?? 0;
  const winner = judge
    ? solution1Score === solution2Score
      ? "draw"
      : solution1Score > solution2Score
        ? "solution-1"
        : "solution-2"
    : null;

  return (
    <div className="my-8 flex w-full flex-col gap-6 px-2 md:px-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/8 bg-black/60 px-5 py-4 backdrop-blur-xl">
        <div>
          <h3 className="text-lg font-semibold text-[#f4f1ea]">
            {judge
              ? winner === "draw"
                ? "A technical draw"
                : `${winner === "solution-1" ? "Solution 1" : "Solution 2"} takes the round`
              : "Waiting for judge output"}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <article
          className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1 ${winner === "solution-1" ? "ring-1 ring-violet-400/50" : ""}`}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/12 text-sm font-semibold text-violet-200 ring-1 ring-violet-400/20">
                01
              </span>
              <div>
                <h4 className="text-xl font-semibold text-[#f4f1ea]">
                  Solution 1
                </h4>
              </div>
            </div>
            {judge && (
              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-violet-200">
                {winner === "solution-1" ? "Winner" : "Contender"}
              </span>
            )}
          </div>
          <div className="prose prose-invert max-w-none">
            <MarkdownBlock content={solution1} />
          </div>
        </article>

        <article
          className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1 ${winner === "solution-2" ? "ring-1 ring-violet-400/50" : ""}`}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/12 text-sm font-semibold text-violet-200 ring-1 ring-violet-400/20">
                02
              </span>
              <div>
                <h4 className="text-xl font-semibold text-[#f4f1ea]">
                  Solution 2
                </h4>
              </div>
            </div>
            {judge && (
              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-violet-200">
                {winner === "solution-2" ? "Winner" : "Contender"}
              </span>
            )}
          </div>
          <div className="prose prose-invert max-w-none">
            <MarkdownBlock content={solution2} />
          </div>
        </article>
      </div>

      {judge && (
        <section className="rounded-[2rem] border border-white/10 bg-black/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-[#f4f1ea]">
                Why this round landed where it did
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-5 rounded-[1.35rem] border border-white/8 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <ScoreMeter
                label="Solution 1 score"
                score={solution1Score}
                tone="violet"
              />
              <p className="border-t border-white/8 pt-4 text-sm leading-7 text-zinc-300">
                {judge.solution_1_reasoning}
              </p>
            </div>

            <div className="space-y-5 rounded-[1.35rem] border border-white/8 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <ScoreMeter
                label="Solution 2 score"
                score={solution2Score}
                tone="cyan"
              />
              <p className="border-t border-white/8 pt-4 text-sm leading-7 text-zinc-300">
                {judge.solution_2_reasoning}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
