import React from "react";

/**
 * Reusable shimmer skeleton — eliminates blank-flash while data loads.
 * Usage: <SkeletonCard rows={4} />
 */
export default function SkeletonCard({ rows = 3, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 ${className}`}>
      {/* Header bar */}
      <div className="h-4 w-1/3 bg-slate-200 rounded-full animate-pulse" />

      {/* Row shimmer lines */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="h-3 bg-slate-200 rounded-full animate-pulse"
              style={{ width: `${65 + (i % 3) * 12}%`, animationDelay: `${i * 80}ms` }}
            />
          </div>
        ))}
      </div>

      {/* Footer shimmer */}
      <div className="h-3 w-1/4 bg-slate-100 rounded-full animate-pulse" />
    </div>
  );
}

/**
 * Full-page skeleton grid — shows while a dashboard tab is loading its data.
 */
export function SkeletonGrid({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} rows={3} />
      ))}
    </div>
  );
}

/**
 * Full-page skeleton list — shown while loading list/table views.
 */
export function SkeletonList({ count = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <div
            className="w-8 h-8 rounded-full bg-slate-200 animate-pulse shrink-0"
            style={{ animationDelay: `${i * 60}ms` }}
          />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-200 rounded-full w-1/3 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
            <div className="h-2 bg-slate-100 rounded-full w-2/3 animate-pulse" style={{ animationDelay: `${i * 60 + 40}ms` }} />
          </div>
          <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}
