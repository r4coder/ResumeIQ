import React from 'react';

function Skeleton({ className = '' }) {
  return (
    <div className={`rounded-lg shimmer-bg bg-obsidian-100 dark:bg-obsidian-800 ${className}`} />
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-14 h-14 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="w-20 h-8 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATS Score skeleton */}
        <div className="glass-card p-6 flex flex-col items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="w-44 h-44 rounded-full" />
          <div className="grid grid-cols-4 gap-2 w-full">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Skills skeleton */}
        <div className="lg:col-span-2 glass-card p-6 space-y-5">
          <Skeleton className="h-4 w-28" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <div className="flex flex-wrap gap-2">
                {[...Array(4 + i)].map((_, j) => (
                  <Skeleton key={j} className="h-7 rounded-lg" style={{ width: `${60 + j * 15}px` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-start gap-3">
                  <Skeleton className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
                  <Skeleton className="h-3 flex-1" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
