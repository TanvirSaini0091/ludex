import { useState, useEffect } from "react"
import {
  Gamepad2,
  ChevronRight,
  Activity,
  ShieldCheck,
  Fingerprint,
  Clock,
  ArrowUpRight,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export const OverviewTab = () => {
  const { user } = useAuth()

  const [recentGames, setRecentGames] = useState<any[]>([])
  const [libraryStats, setLibraryStats] = useState({
    totalGames: 0,
    totalHours: 0,
    recentHours: 0,
  })
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    const fetchSteamData = async () => {
      try {
        let recentHoursTotal = 0

        const recentRes = await fetch("/api/steam/recent")
        if (recentRes.ok) {
          const recentData = await recentRes.json()
          const games = recentData.games || []
          setRecentGames(games)

          if (games.length > 0) {
            recentHoursTotal =
              games.reduce(
                (acc: number, g: any) => acc + (g.playtime_2weeks || 0),
                0
              ) / 60
          }
        }

        const libRes = await fetch("/api/steam/library")
        if (libRes.ok) {
          const libData = await libRes.json()
          const games = libData.games || []
          const totalMinutes = games.reduce(
            (acc: number, game: any) => acc + game.playtime_forever,
            0
          )

          setLibraryStats({
            totalGames: libData.game_count || 0,
            totalHours: Math.round(totalMinutes / 60),
            recentHours: recentHoursTotal,
          })
        }
      } catch (error) {
        console.error("Failed to fetch Steam data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchSteamData()
  }, [])

  const memberSinceYear = user?.timecreated
    ? new Date(user.timecreated * 1000).getFullYear()
    : "Unknown"
  const maskedSid = user?.steamid ? `••••${user.steamid.slice(-4)}` : "••••0000"

  const isProfilePublic = user?.communityvisibilitystate === 3
  const profileBadgeText = isProfilePublic ? "PUBLIC" : "PRIVATE"
  const profileBadgeColor = isProfilePublic
    ? "bg-emerald-500/20 text-emerald-500"
    : "bg-destructive/20 text-destructive"

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      {/* ── KPI Row ── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-6 shadow-sm backdrop-blur-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Gamepad2 className="size-16" />
          </div>
          <p className="mb-1 text-sm font-medium text-muted-foreground">
            Total Games
          </p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {isLoadingData ? "--" : libraryStats.totalGames}
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs text-primary">
            <ShieldCheck className="size-3" /> Steam Authenticated
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-6 shadow-sm backdrop-blur-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="size-16" />
          </div>
          <p className="mb-1 text-sm font-medium text-muted-foreground">
            Total Playtime
          </p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {isLoadingData
              ? "--"
              : `${libraryStats.totalHours.toLocaleString()}`}
            <span className="ml-1 text-base font-normal text-muted-foreground">
              hrs
            </span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Across entire library
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-6 shadow-sm backdrop-blur-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="size-16" />
          </div>
          <p className="mb-1 text-sm font-medium text-muted-foreground">
            Recent Playtime
          </p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {isLoadingData ? "--" : `${libraryStats.recentHours.toFixed(1)}`}
            <span className="ml-1 text-base font-normal text-muted-foreground">
              hrs
            </span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Past 2 weeks</p>
        </div>
      </section>

      {/* ── Main Data Grid ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Recently Played */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/40 shadow-sm backdrop-blur-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border/50 bg-black/20 px-6 py-5">
            <h2 className="text-sm font-semibold tracking-wider text-foreground uppercase">
              Recently Played
            </h2>
            <button className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80">
              View All <ChevronRight className="size-3" />
            </button>
          </div>

          <div className="flex-1 divide-y divide-border/50">
            {isLoadingData ? (
              <div className="flex flex-col items-center gap-4 p-12 text-center text-sm text-muted-foreground">
                <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Loading Steam data...
              </div>
            ) : recentGames.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted-foreground">
                No games played in the last 2 weeks.
              </div>
            ) : (
              recentGames.map((g) => (
                <div
                  key={g.appid}
                  className="group flex cursor-pointer items-center gap-5 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                >
                  {/* SMALL ICON RENDERING */}
                  <img
                    src={`http://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`}
                    alt={g.name}
                    className="size-10 shrink-0 rounded border border-border/50 bg-black/20 shadow-sm"
                    onError={(e) => {
                      // Fallback for completely missing icons (rare, but good practice)
                      e.currentTarget.style.display = "none"
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                      {g.name}
                    </p>
                    <p className="mt-0.5 text-xs tracking-wide text-muted-foreground">
                      App ID: {g.appid}
                    </p>
                  </div>
                  <div className="shrink-0 border-r border-border/50 px-4 text-right">
                    <p className="text-sm font-medium text-foreground tabular-nums">
                      {(g.playtime_2weeks / 60).toFixed(1)}h
                    </p>
                    <p className="mt-0.5 text-[10px] tracking-widest text-muted-foreground uppercase">
                      Recent
                    </p>
                  </div>
                  <div className="w-20 shrink-0 text-right">
                    <p className="text-sm font-medium text-foreground tabular-nums">
                      {Math.round(g.playtime_forever / 60)}h
                    </p>
                    <p className="mt-0.5 text-[10px] tracking-widest text-muted-foreground uppercase">
                      Total
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Player Profile */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-border/50 bg-card/40 p-1 shadow-sm backdrop-blur-sm">
            <div className="rounded-lg bg-black/20 p-5">
              <div className="mb-6 flex items-center gap-3">
                <Fingerprint className="size-4 text-primary" />
                <h2 className="text-sm font-semibold tracking-wider text-foreground uppercase">
                  Steam Profile
                </h2>
              </div>

              <div className="flex flex-col items-center border-b border-border/50 pb-6 text-center">
                <div className="relative mb-4">
                  <img
                    src={user?.avatarfull || ""}
                    alt="Full Avatar"
                    className="size-24 rounded-lg border-2 border-border shadow-lg"
                  />

                  <div
                    className={`absolute -right-2 -bottom-2 rounded-sm border border-border/50 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md ${profileBadgeColor}`}
                  >
                    {profileBadgeText}
                  </div>
                </div>
                <h3 className="text-xl font-bold">
                  {user?.personaname || "Unknown User"}
                </h3>

                <p
                  className="mt-1 font-mono text-xs text-muted-foreground"
                  title="Steam ID masked for privacy"
                >
                  ID: {maskedSid}
                </p>
              </div>

              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Account Status</span>
                  <span className="font-medium text-emerald-500">Public</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">{memberSinceYear}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Profile Link</span>
                  <a
                    href={user?.profileurl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    Steam Community <ArrowUpRight className="size-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/40 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wider text-foreground uppercase">
                API Connection
              </h2>
              <ShieldCheck className="size-4 text-emerald-500" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Steam Web API
                  </span>
                  <span className="font-mono text-xs text-emerald-500">
                    ONLINE
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/40">
                  <div
                    className="h-full rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
