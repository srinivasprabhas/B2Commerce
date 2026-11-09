"use client";

import { Avatar, AvatarFallback } from "@b2c/ui/components/avatar";
import { Button } from "@b2c/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@b2c/ui/components/dropdown-menu";
import { Separator } from "@b2c/ui/components/separator";
import { Bell, ChevronsUpDown, LogOut, Moon, PanelLeftClose, Search, Settings, Sun, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSidebar } from "@/components/layout/sidebar-context";

const notifications = [
  { title: "New order #84231", time: "2 min ago" },
  { title: "Low stock: Fieldtone ANC 700 (Silver)", time: "1 hour ago" },
  { title: "New review on Quill 65% Keyboard", time: "Yesterday" },
];

export function SiteHeader() {
  const { toggle } = useSidebar();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/40 backdrop-blur-md md:rounded-tl-xl md:rounded-tr-xl">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2">
        <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label="Toggle sidebar">
          <PanelLeftClose />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-1" />}>
            Tech Commerce
            <ChevronsUpDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Stores</DropdownMenuLabel>
              <DropdownMenuItem>Tech Commerce</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-1 h-4!" />

        <Button
          variant="outline"
          size="sm"
          className="hidden h-8 w-56 justify-start gap-2 font-normal text-muted-foreground md:inline-flex"
          onClick={() => router.push("/dashboard/pages/products")}
        >
          <Search />
          Search...
          <kbd className="ml-auto rounded border bg-muted px-1.5 font-mono text-[10px]">⌘K</kbd>
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="relative" aria-label="Notifications" />}>
              <Bell />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-red-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                {notifications.map((n) => (
                  <DropdownMenuItem key={n.title} className="flex-col items-start gap-0.5">
                    <span className="text-sm">{n.title}</span>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Sun className="dark:hidden" />
            <Moon className="hidden dark:block" />
          </Button>

          <Separator orientation="vertical" className="h-4!" />

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer rounded-full outline-none" aria-label="Account">
              <Avatar>
                <AvatarFallback className="rounded-lg">AD</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="font-medium text-foreground">Admin</div>
                  <div className="text-xs font-normal">admin@techcommerce.example</div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/dashboard/pages/settings" />}>
                <UserRound />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/dashboard/pages/settings" />}>
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/login" />}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
