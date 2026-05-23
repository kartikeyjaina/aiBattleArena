import React from "react";

export default function UserMessage({ message }) {
  return (
    <div className="flex justify-end my-6">
      <div className="group relative max-w-[82%] overflow-hidden rounded-[1.75rem] border border-violet-400/15 bg-black/85 px-5 py-4 text-left shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl md:max-w-[72%]">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-[1px] rounded-[1.7rem] border border-white/5 bg-black/70" />
        <div className="relative">
          <p className="text-balance text-[1.02rem] leading-7 text-[#f4f1ea] md:text-[1.05rem]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
