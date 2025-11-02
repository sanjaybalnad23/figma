"use client";

import type { ReactNode } from "react";

export default function IconButton({
  children,
  disabled,
  isActive,
  onClick,
}: {
  onClick: () => void;
  children: ReactNode;
  isActive?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center min-h-[28px] rounded-md text-gray-500 hover:enabled:text-gray-700 focus:enabled:text-gray-700 active:enabled:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 ${isActive ? "bg-gray-100 text-blue-600" : ""}`}
    >
      {children}
    </button>
  );
}
