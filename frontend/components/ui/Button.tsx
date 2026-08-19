import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  children,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 active:translate-y-0.5",
    secondary:
      "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-100 active:translate-y-0.5",
    outline:
      "border border-zinc-300 dark:border-zinc-600 hover:border-sky-500 dark:hover:border-sky-500 text-zinc-800 dark:text-zinc-200 hover:text-sky-600 dark:hover:text-sky-400 bg-transparent",
    ghost:
      "text-zinc-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
          {icon}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
      {icon}
    </button>
  );
}
