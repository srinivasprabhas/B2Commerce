import type { CSSProperties } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { SiteHeader } from "@/components/layout/site-header";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <SidebarProvider>
      <div
        className="flex min-h-svh w-full bg-sidebar"
        style={
          {
            "--sidebar-width": "16rem",
            "--header-height": "3.5rem",
            "--content-padding": "1rem",
          } as CSSProperties
        }
      >
        <AppSidebar />
        {/* Inset panel: rounded, raised content area beside the sidebar */}
        <main className="relative flex min-w-0 flex-1 flex-col bg-background md:m-2 md:ml-0 md:rounded-xl md:shadow-sm md:ring-1 md:ring-foreground/5">
          <SiteHeader />
          <div className="flex-1 p-(--content-padding) lg:[--content-padding:1.5rem]">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
