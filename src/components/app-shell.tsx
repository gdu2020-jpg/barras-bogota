import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Map, Plus, Route } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Explorar", icon: Map },
  { to: "/aportar", label: "Aportar", icon: Plus },
  { to: "/rutas", label: "Rutas", icon: Route },
  { to: "/favoritos", label: "Favoritos", icon: Heart },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh max-w-full flex-col overflow-x-hidden bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex min-w-0 items-baseline gap-2">
            <span className="font-display text-lg font-semibold tracking-tight">
              Barras Bogotá
            </span>
            <span className="hidden text-xs uppercase tracking-widest text-subtle sm:inline">
              Gratis
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                    active
                      ? "bg-elevated text-fg"
                      : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="min-w-0 flex-1 pb-20 md:pb-0">{children}</div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 backdrop-blur-md md:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-4 px-1 pb-[env(safe-area-inset-bottom)]">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium",
                    active ? "text-fg" : "text-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
