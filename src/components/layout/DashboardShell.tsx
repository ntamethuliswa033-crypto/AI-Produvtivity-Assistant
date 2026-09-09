import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronLeft,
  Menu,
  Search,
  Sparkles,
  ChevronDown,
  LogOut,
  UserRound,
} from "lucide-react";

import { navItems, type NavItem } from "./nav-items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const notifications = [
  { title: "Weekly usage report ready", time: "10 min ago" },
  { title: "3 drafts saved from Email Generator", time: "Yesterday" },
  { title: "Task plan for this week generated", time: "2 days ago" },
];

function NavLinks({
  collapsed,
  onNavigate,
  pathname,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  pathname: string;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {navItems.map((item: NavItem) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary",
              collapsed && "justify-center px-2",
            )}
          >
            <Icon className="size-[18px] shrink-0" aria-hidden="true" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 px-5 py-5", collapsed && "justify-center px-2")}>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-sidebar-foreground">
            Workplace AI
          </span>
          <span className="block truncate text-xs text-sidebar-foreground/60">
            Productivity Assistant
          </span>
        </span>
      )}
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-[76px]" : "w-[268px]",
        )}
      >
        <SidebarBrand collapsed={collapsed} />
        <NavLinks collapsed={collapsed} pathname={pathname} />
        <div className="p-3">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-sidebar-border px-3 py-2 text-xs font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] border-sidebar-border bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col pt-2">
                <SidebarBrand collapsed={false} />
                <NavLinks collapsed={false} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold sm:text-base">
              AI Workplace Productivity Assistant
            </h1>
          </div>

          <div className="relative hidden w-64 md:block xl:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools, drafts, notes…"
              className="pl-9"
              aria-label="Search"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="size-5" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <Badge variant="secondary">{notifications.length} new</Badge>
              </div>
              <ul className="divide-y divide-border">
                {notifications.map((n) => (
                  <li key={n.title} className="px-4 py-3">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  TN
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-semibold leading-tight">Thuliswa N.</span>
                  <span className="block text-xs leading-tight text-muted-foreground">
                    Pro workspace
                  </span>
                </span>
                <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <UserRound className="mr-2 size-4" /> Profile & settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>

        <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          AI may make mistakes. Review all outputs before use. Avoid entering confidential or
          personal information unless allowed.
        </footer>
      </div>
    </div>
  );
}
