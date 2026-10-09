"use client";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`spinner relative h-7 w-7 ${className}`}>
      <i /><i /><i /><i /><i /><i />
    </div>
  );
}

export default function BootScreen() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-24 bg-black">
      <div className="grid grid-cols-2 gap-1 animate-fade">
        <span className="h-10 w-10 bg-[#4cc2ff]" /><span className="h-10 w-10 bg-[#4cc2ff]" />
        <span className="h-10 w-10 bg-[#4cc2ff]" /><span className="h-10 w-10 bg-[#4cc2ff]" />
      </div>
      <Spinner />
    </div>
  );
}
