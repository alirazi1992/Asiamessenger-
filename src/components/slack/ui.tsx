"use client";
import * as React from "react";

export function Avatar({
  name,
  src,
  size = 36,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  const initials = name?.slice(0, 1)?.toUpperCase() || "?";
  return (
    <div
      className="grid place-items-center rounded bg-neutral-800 text-neutral-200 shrink-0"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full rounded object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}

export function IconBtn({
  title,
  onClick,
  children,
}: React.PropsWithChildren<{ title: string; onClick?: () => void }>) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="rounded p-1 hover:bg-neutral-800 text-neutral-300"
    >
      {children}
    </button>
  );
}

export function Pill({ children }: React.PropsWithChildren) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">
      {children}
    </span>
  );
}
