import { useState } from 'react';
import {
    Grid2x2Plus, LayoutDashboard, Gamepad2, Trophy,
    Settings, LogOut, ChevronRight, TrendingUp, TrendingDown,
    Library, BarChart3, Users, Search, Bell,
    Flame, Star, Monitor, ArrowUpRight, Activity, Menu, X,
    PanelLeftDashed,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

// Note: Replace with real AuthContext once built
const useAuth = () => ({
    logout: () => console.log('Session Terminated'),
});

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
    { label: 'Overview', icon: LayoutDashboard, active: true },
    { label: 'Library', icon: Library },
    { label: 'Achievements', icon: Trophy },
    { label: 'Analytics', icon: BarChart3 },
    { label: 'Friends', icon: Users },
    { label: 'Settings', icon: Settings },
];

const KPI = [
    { label: 'Total Games', value: '184', change: '+6', trend: 'up' as const, sub: 'across 3 platforms' },
    { label: 'Playtime', value: '3,492h', change: '+127h', trend: 'up' as const, sub: 'this month' },
    { label: 'Achievements', value: '1,247', change: '+34', trend: 'up' as const, sub: '68% completion' },
    { label: 'Avg Session', value: '2.4h', change: '-0.3h', trend: 'down' as const, sub: 'vs last month' },
];

const RECENT_GAMES = [
    { name: 'Elden Ring', platform: 'Steam', hours: 342, lastPlayed: '2 hours ago', completion: 87 },
    { name: 'Hades II', platform: 'Steam', hours: 156, lastPlayed: 'Yesterday', completion: 64 },
    { name: 'Balatro', platform: 'Steam', hours: 89, lastPlayed: '3 days ago', completion: 91 },
    { name: 'Celeste', platform: 'Epic', hours: 67, lastPlayed: '1 week ago', completion: 100 },
    { name: 'Hollow Knight', platform: 'Steam', hours: 112, lastPlayed: '2 weeks ago', completion: 78 },
];

const PLATFORMS = [
    { name: 'Steam', count: 142, color: 'bg-primary' },
    { name: 'Epic Games', count: 38, color: 'bg-muted-foreground' },
    { name: 'Xbox', count: 4, color: 'bg-muted-foreground/50' },
];

const RECENT_ACHIEVEMENTS = [
    { name: 'Lord of Frenzied Flame', game: 'Elden Ring', rarity: 4.2 },
    { name: 'Extreme Measures IV', game: 'Hades II', rarity: 1.8 },
    { name: 'Ante Up', game: 'Balatro', rarity: 42 },
];

// Weekly playtime data (Mon-Sun, last 4 weeks)
const WEEKLY_DATA = [
    { day: 'Mon', h: [1.2, 2.1, 0.5, 1.8] },
    { day: 'Tue', h: [0.8, 1.5, 2.3, 0.9] },
    { day: 'Wed', h: [2.5, 0.7, 1.8, 3.1] },
    { day: 'Thu', h: [1.1, 3.2, 0.4, 2.0] },
    { day: 'Fri', h: [3.8, 2.8, 4.1, 3.5] },
    { day: 'Sat', h: [5.2, 4.5, 3.9, 6.1] },
    { day: 'Sun', h: [4.1, 3.9, 5.0, 4.8] },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                         */
/* ------------------------------------------------------------------ */
export const Dashboard = () => {
    const { logout } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeNav, setActiveNav] = useState('Overview');

    const chartData = WEEKLY_DATA.map((d) => ({
        day: d.day,
        'This Week': d.h[3],
        'Last Week': d.h[2],
    }));

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">

            {/* ━━━ DESKTOP SIDEBAR ━━━ */}
            <aside className={`hidden md:flex flex-col border-r border-border bg-background transition-all duration-300 ${sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'} shrink-0`}>
                {/* Brand */}
                <div className="flex items-center gap-2.5 px-5 h-[60px] border-b border-border shrink-0">
                    <Grid2x2Plus className="size-6 text-primary shrink-0" aria-hidden="true" />
                    {!sidebarCollapsed && (
                        <span className="text-lg font-bold tracking-tight truncate">Ludex</span>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5" aria-label="Desktop Navigation">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveNav(item.label)}
                            className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                activeNav === item.label
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                            }`}
                            title={sidebarCollapsed ? item.label : undefined}
                            aria-label={item.label}
                        >
                            <item.icon className="size-4 shrink-0" aria-hidden="true" />
                            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <Separator />

                {/* Sidebar footer */}
                <div className="p-3 space-y-1">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <PanelLeftDashed className="size-4 shrink-0" aria-hidden="true" />
                        {!sidebarCollapsed && <span>Collapse</span>}
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        aria-label="Sign Out"
                    >
                        <LogOut className="size-4 shrink-0" aria-hidden="true" />
                        {!sidebarCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* ━━━ MOBILE SIDEBAR ━━━ */}
            <div className={`fixed inset-0 z-50 flex md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div 
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
                <aside className={`relative w-[240px] flex flex-col border-r border-border bg-background h-full shadow-lg transition-transform duration-300 ease-in-out transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex items-center justify-between px-5 h-[60px] border-b border-border shrink-0">
                        <div className="flex items-center gap-2.5">
                            <Grid2x2Plus className="size-6 text-primary shrink-0" aria-hidden="true" />
                            <span className="text-lg font-bold tracking-tight truncate">Ludex</span>
                        </div>
                        <button 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="text-muted-foreground hover:text-foreground p-2 -mr-2 rounded-md hover:bg-accent"
                            aria-label="Close menu"
                        >
                            <X className="size-5" aria-hidden="true" />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5" aria-label="Mobile Navigation">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => {
                                    setActiveNav(item.label);
                                    setMobileMenuOpen(false);
                                }}
                                className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    activeNav === item.label
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                                }`}
                                aria-label={item.label}
                            >
                                <item.icon className="size-4 shrink-0" aria-hidden="true" />
                                <span className="truncate">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                    <Separator />
                    <div className="p-3">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            aria-label="Sign Out"
                        >
                            <LogOut className="size-4 shrink-0" aria-hidden="true" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>
            </div>

            {/* ━━━ MAIN AREA ━━━ */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* ── Top Bar ── */}
                <header className="flex items-center justify-between h-[60px] px-4 md:px-6 border-b border-border shrink-0">
                    <div className="flex items-center gap-3">
                        <button 
                            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="size-5" aria-hidden="true" />
                        </button>
                        <h1 className="text-lg font-semibold tracking-tight">Overview</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" aria-hidden="true" />
                            <input
                                type="text"
                                aria-label="Search games"
                                placeholder="Search games..."
                                className="h-8 w-56 rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                            />
                        </div>
                        <button 
                            className="relative size-8 flex items-center justify-center rounded-lg border border-input hover:bg-accent transition-colors"
                            aria-label="Notifications"
                        >
                            <Bell className="size-4 text-muted-foreground" aria-hidden="true" />
                            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-destructive" aria-hidden="true" />
                        </button>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-2.5">
                            <div className="size-7 rounded-full bg-primary/10 border border-border flex items-center justify-center">
                                <span className="text-xs font-semibold text-primary">TS</span>
                            </div>
                            {/* Hide name on small screens */}
                            <span className="hidden md:inline text-sm font-medium">TanvirSaini</span>
                        </div>
                    </div>
                </header>

                {/* ── Scrollable Content ── */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6 max-w-[1400px]">

                        {/* KPI Row */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {KPI.map((k) => (
                                <div key={k.label} className="rounded-xl border border-border bg-card p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm text-muted-foreground">{k.label}</p>
                                        {k.trend === 'up'
                                            ? <TrendingUp className="size-4 text-emerald-500" />
                                            : <TrendingDown className="size-4 text-destructive" />
                                        }
                                    </div>
                                    <p className="text-2xl font-bold tracking-tight text-card-foreground">{k.value}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className={`text-xs font-medium ${k.trend === 'up' ? 'text-emerald-500' : 'text-destructive'}`}>
                                            {k.change}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{k.sub}</span>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Two‑column layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                            {/* ── Recent Games Table ── */}
                            <div className="lg:col-span-3 rounded-xl border border-border bg-card">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                                    <div className="flex items-center gap-2">
                                        <Gamepad2 className="size-4 text-muted-foreground" />
                                        <h2 className="text-sm font-semibold">Recently Played</h2>
                                    </div>
                                    <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                                        View all <ChevronRight className="size-3" />
                                    </button>
                                </div>
                                <div className="divide-y divide-border">
                                    {RECENT_GAMES.map((g) => (
                                        <div key={g.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-accent/30 transition-colors cursor-pointer group">
                                            <div className="size-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                                                <Gamepad2 className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{g.name}</p>
                                                <p className="text-xs text-muted-foreground">{g.platform} · {g.lastPlayed}</p>
                                            </div>
                                            <div className="hidden sm:block text-right shrink-0">
                                                <p className="text-sm font-medium tabular-nums">{g.hours}h</p>
                                                <p className="text-xs text-muted-foreground">played</p>
                                            </div>
                                            <div className="hidden md:flex items-center gap-2 w-28 shrink-0">
                                                <div className="flex-1 h-1.5 rounded-full bg-accent overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-primary transition-all duration-500"
                                                        style={{ width: `${g.completion}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{g.completion}%</span>
                                            </div>
                                            <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── Right Sidebar Stack ── */}
                            <div className="lg:col-span-2 space-y-4">

                                {/* Platforms */}
                                <div className="rounded-xl border border-border bg-card p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Monitor className="size-4 text-muted-foreground" />
                                        <h2 className="text-sm font-semibold">Platforms</h2>
                                    </div>
                                    <div className="space-y-3">
                                        {PLATFORMS.map((p) => {
                                            const total = PLATFORMS.reduce((a, b) => a + b.count, 0);
                                            const pct = Math.round((p.count / total) * 100);
                                            return (
                                                <div key={p.name}>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="text-sm">{p.name}</span>
                                                        <span className="text-xs text-muted-foreground tabular-nums">{p.count} games</span>
                                                    </div>
                                                    <div className="h-1.5 rounded-full bg-accent overflow-hidden">
                                                        <div className={`h-full rounded-full ${p.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Recent Achievements */}
                                <div className="rounded-xl border border-border bg-card p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Trophy className="size-4 text-muted-foreground" />
                                        <h2 className="text-sm font-semibold">Recent Achievements</h2>
                                    </div>
                                    <div className="space-y-3">
                                        {RECENT_ACHIEVEMENTS.map((a) => (
                                            <div key={a.name} className="flex items-start gap-3">
                                                <div className="size-8 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-0.5">
                                                    <Star className="size-3.5 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{a.name}</p>
                                                    <p className="text-xs text-muted-foreground">{a.game}</p>
                                                </div>
                                                <span className={`text-xs font-medium shrink-0 px-2 py-0.5 rounded-full ${
                                                    a.rarity < 5 ? 'bg-primary/10 text-primary' : 'bg-accent text-muted-foreground'
                                                }`}>
                                                    {a.rarity}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Weekly Activity Chart ── */}
                        <div className="rounded-xl border border-border bg-card p-5">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <Activity className="size-4 text-muted-foreground" aria-hidden="true" />
                                    <h2 className="text-sm font-semibold">Weekly Activity</h2>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />This week</span>
                                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-muted-foreground/30" />Last week</span>
                                </div>
                            </div>
                            <div className="h-[280px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        barGap={4}
                                        barCategoryGap="20%"
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="var(--color-border)"
                                            opacity={0.3}
                                        />
                                        <XAxis
                                            dataKey="day"
                                            stroke="var(--color-muted-foreground)"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={12}
                                        />
                                        <YAxis
                                            stroke="var(--color-muted-foreground)"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'var(--color-accent)', opacity: 0.15 }}
                                            contentStyle={{
                                                background: 'var(--color-card)',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                                fontFamily: 'inherit',
                                            }}
                                            labelStyle={{
                                                fontWeight: 'bold',
                                                color: 'var(--color-foreground)',
                                                marginBottom: '4px',
                                            }}
                                            itemStyle={{
                                                color: 'var(--color-foreground)',
                                                padding: '2px 0',
                                            }}
                                        />
                                        <Bar
                                            dataKey="Last Week"
                                            fill="var(--color-muted-foreground)"
                                            opacity={0.25}
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="This Week"
                                            fill="var(--color-primary)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* ── Quick Stats Footer ── */}
                        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Current Streak', value: '14 days', icon: Flame },
                                { label: 'Peak Day', value: 'Saturday', icon: TrendingUp },
                                { label: 'Most Played', value: 'Elden Ring', icon: Gamepad2 },
                                { label: 'Completion Rate', value: '68%', icon: Activity },
                            ].map((s) => (
                                <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                                    <div className="size-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                                        <s.icon className="size-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground truncate">{s.label}</p>
                                        <p className="text-sm font-semibold truncate">{s.value}</p>
                                    </div>
                                </div>
                            ))}
                        </section>

                    </div>
                </main>
            </div>
        </div>
    );
};