import { useState } from "react"
import {
  Grid2x2Plus,
  LayoutDashboard,
  Settings,
  LogOut,
  Library,
  BarChart3,
  Users,
  Search,
  Bell,
  Menu,
  PanelLeftDashed,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { OverviewTab } from "@/components/dashboard/OverviewTab"
import { LibraryTab } from "@/components/dashboard/LibraryTab"
import { FriendsTab } from "@/components/dashboard/FriendsTab"
import { AchievementsTab } from "@/components/dashboard/AchievementsTab"

/* ------------------------------------------------------------------ */
/* NAVIGATION & ICONS                                                 */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Library", icon: Library },
  { label: "Achievements", icon: BarChart3 },
  { label: "Friends", icon: Users },
  { label: "Settings", icon: Settings },
]

export const Dashboard = () => {
  const { user, logout } = useAuth()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState("Overview")

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      {/* ━━━ DESKTOP SIDEBAR ━━━ */}
      <aside
        className={`hidden flex-col border-r border-border bg-card/30 backdrop-blur-md transition-all duration-300 md:flex ${sidebarCollapsed ? "w-[68px]" : "w-[240px]"} shrink-0`}
      >
        <div className="flex h-[60px] shrink-0 items-center gap-3 border-b border-border px-5">
          <Grid2x2Plus
            className="size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          {!sidebarCollapsed && (
            <span className="text-base font-bold tracking-tight">Ludex</span>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
                activeNav === item.label
                  ? "border border-primary/20 bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              {!sidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <Separator className="opacity-50" />

        <div className="space-y-1 p-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <PanelLeftDashed className="size-4 shrink-0" aria-hidden="true" />
            {!sidebarCollapsed && <span>Toggle Sidebar</span>}
          </button>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ━━━ MAIN AREA ━━━ */}
      <div className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-background to-background">
        {/* ── Top Bar ── */}
        <header className="z-10 flex h-[60px] shrink-0 items-center justify-between border-b border-border/50 bg-background/50 px-4 backdrop-blur-sm md:px-8">
          <div className="flex items-center gap-4">
            <button
              className="-ml-2 p-2 text-muted-foreground hover:text-foreground md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-lg font-medium tracking-tight">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search library..."
                className="h-9 w-64 rounded-md border border-border bg-black/20 pr-3 pl-9 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none"
              />
            </div>
            <button className="relative flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-accent">
              <Bell className="size-4 text-muted-foreground" />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
            </button>
            <Separator orientation="vertical" className="h-5 opacity-50" />
            <div className="group flex cursor-pointer items-center gap-3">
              <img
                src={user?.avatarmedium || ""}
                alt="Profile"
                className="size-8 rounded-sm border border-border transition-colors group-hover:border-primary/50"
              />
              <span className="hidden text-sm font-medium transition-colors group-hover:text-primary md:inline">
                {user?.personaname || "Player"}
              </span>
            </div>
          </div>
        </header>

        {/* ── Scrollable Content ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeNav === "Overview" && <OverviewTab />}

          {activeNav === "Library" && <LibraryTab />}
          {activeNav === "Achievements" && <AchievementsTab />}
          {activeNav === "Friends" && <FriendsTab />}
          {activeNav === "Settings" && (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Settings Component Placeholder
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
