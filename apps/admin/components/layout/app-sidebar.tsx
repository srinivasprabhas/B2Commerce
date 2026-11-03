"use client";

import { Sheet, SheetContent, SheetTitle } from "@b2c/ui/components/sheet";
import { cn } from "@b2c/ui/lib/utils";
import { ChevronRight, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSidebar } from "@/components/layout/sidebar-context";
import { type NavItem, navGroups } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard/pages/products") return pathname === href;
  if (href === "/dashboard/pages/orders") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function CollapsibleItem({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate?: () => void }) {
  const childActive = item.items?.some((l) => isActive(pathname, l.href)) ?? false;
  const [open, setOpen] = useState(true);
  const Icon = item.icon;
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex h-8 w-full items-center gap-2 rounded-md p-2 text-left text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0",
          childActive && "font-medium",
        )}
      >
        <Icon />
        <span className="truncate">{item.title}</span>
        <ChevronRight className={cn("ml-auto transition-transform duration-200", open && "rotate-90")} />
      </button>
      {open && (
        <ul className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
          {item.items?.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                data-active={isActive(pathname, link.href) || undefined}
                className="flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground"
              >
                <span className="truncate">{link.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex size-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-(--header-height) items-center px-4">
        <Link href="/dashboard/ecommerce" onClick={onNavigate} className="flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Store className="size-4" />
          </span>
          B2Commerce
        </Link>
      </div>
      <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
        {navGroups.map((group) => (
          <div key={group.title} className="relative flex w-full min-w-0 flex-col p-2">
            <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70">
              {group.title}
            </div>
            <ul className="flex w-full min-w-0 flex-col gap-1">
              {group.items.map((item) =>
                item.items ? (
                  <CollapsibleItem key={item.title} item={item} pathname={pathname} onNavigate={onNavigate} />
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      data-active={isActive(pathname, item.href) || undefined}
                      className="flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0"
                    >
                      <item.icon />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

export function AppSidebar() {
  const { open, mobileOpen, setMobileOpen } = useSidebar();
  return (
    <>
      <aside
        data-state={open ? "expanded" : "collapsed"}
        className={cn(
          "sticky top-0 hidden h-svh shrink-0 overflow-hidden transition-[width] duration-200 ease-linear md:block",
          open ? "w-(--sidebar-width)" : "w-0",
        )}
      >
        <div className="h-full w-(--sidebar-width)">
          <SidebarBody />
        </div>
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-(--sidebar-width) p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarBody onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
