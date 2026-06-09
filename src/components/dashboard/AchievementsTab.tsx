import { useState, useEffect, useRef } from "react"
import { Trophy, Search, Gamepad2, Medal, Loader2, ChevronDown, Check, Lock } from "lucide-react"

// Types
interface SteamGame {
  appid: number
  name: string
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  achieved: boolean
  unlockTime: number | null
}

export const AchievementsTab = () => {
  const [games, setGames] = useState<SteamGame[]>([])
  const [selectedAppId, setSelectedAppId] = useState<string>("")
  const [achievements, setAchievements] = useState<Achievement[]>([])
  
  const [isLoadingGames, setIsLoadingGames] = useState(true)
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(false)
  
  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 1. Fetch library on mount
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await fetch("/api/steam/library")
        if (res.ok) {
          const data = await res.json()
          const sortedGames = (data.games || []).sort((a: SteamGame, b: SteamGame) => 
            a.name.localeCompare(b.name)
          )
          setGames(sortedGames)
          if (sortedGames.length > 0) {
            setSelectedAppId(sortedGames[0].appid.toString())
          }
        }
      } catch (error) {
        console.error("Failed to fetch library for achievements:", error)
      } finally {
        setIsLoadingGames(false)
      }
    }
    fetchLibrary()
  }, [])

  // 2. Fetch achievements when game changes
  useEffect(() => {
    if (!selectedAppId) return

    const fetchAchievements = async () => {
      setIsLoadingAchievements(true)
      setAchievements([]) 
      try {
        const res = await fetch(`/api/steam/achievements/${selectedAppId}`)
        if (res.ok) {
          const data = await res.json()
          setAchievements(data)
        }
      } catch (error) {
        console.error("Failed to fetch achievements:", error)
      } finally {
        setIsLoadingAchievements(false)
      }
    }

    fetchAchievements()
  }, [selectedAppId])

  const filteredGames = games.filter((g) => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedGameName = games.find(g => g.appid.toString() === selectedAppId)?.name || "Select a game..."

  // Calculate completion percentage
  const totalAchievements = achievements.length
  const unlockedCount = achievements.filter(a => a.achieved).length
  const completionPercentage = totalAchievements === 0 ? 0 : Math.round((unlockedCount / totalAchievements) * 100)

  return (
    <div className="mx-auto max-w-[1400px] flex flex-col h-[calc(100vh-120px)] space-y-6">
      
      {/* ── Header & Controls ── */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between shrink-0 bg-card/20 p-6 rounded-2xl border border-border/50 backdrop-blur-sm relative z-20">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Trophy className="size-6 text-yellow-500" />
            Trophy Room
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-sm text-muted-foreground">
              Select a game to view your completion progress.
            </p>
            {totalAchievements > 0 && !isLoadingAchievements && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                {completionPercentage}% Completed
              </span>
            )}
          </div>
        </div>

        {/* Custom Combobox Dropdown */}
        <div className="relative w-full sm:w-[350px]" ref={dropdownRef}>
          {isLoadingGames ? (
            <div className="flex h-10 w-full items-center justify-center rounded-md border border-border/50 bg-black/20 text-sm text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" /> Syncing library...
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-border/50 bg-black/20 px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors hover:bg-black/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <span className="truncate">{selectedGameName}</span>
                <ChevronDown className={`size-4 opacity-50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-full rounded-md border border-border/50 bg-card/95 p-1 text-popover-foreground shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95">
                  <div className="flex items-center border-b border-border/50 px-3 pb-2 pt-1">
                    <Search className="mr-2 size-4 shrink-0 opacity-50" />
                    <input
                      type="text"
                      className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Search game..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                    {filteredGames.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No games found.
                      </div>
                    ) : (
                      filteredGames.map((game) => (
                        <button
                          key={game.appid}
                          onClick={() => {
                            setSelectedAppId(game.appid.toString())
                            setIsDropdownOpen(false)
                            setSearchQuery("") // Reset search on select
                          }}
                          className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${
                            selectedAppId === game.appid.toString() ? 'bg-primary/10 text-primary font-medium' : ''
                          }`}
                        >
                          {selectedAppId === game.appid.toString() && (
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                              <Check className="size-4" />
                            </span>
                          )}
                          <span className="truncate text-left w-full">{game.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Achievements Grid ── */}
      <div className="flex-1 overflow-y-auto pr-2 pb-8 custom-scrollbar z-10 relative">
        {!selectedAppId && !isLoadingGames ? (
           <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground rounded-xl border border-dashed border-border/50 bg-card/10 p-12">
            <Gamepad2 className="size-12 opacity-20" />
            <p className="text-base font-medium text-foreground">No game selected</p>
          </div>
        ) : isLoadingAchievements ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm font-medium tracking-wide">Fetching global records...</p>
          </div>
        ) : achievements.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground rounded-xl border border-dashed border-border/50 bg-card/10 p-12">
            <Medal className="size-12 opacity-20" />
            <p className="text-base font-medium text-foreground">No achievements found</p>
            <p className="text-sm">This game does not support Steam Achievements.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {achievements.map((achieve) => (
              <div
                key={achieve.id}
                className={`group relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 backdrop-blur-sm ${
                  achieve.achieved 
                    ? "border-border/50 bg-card/40 hover:-translate-y-1 hover:border-yellow-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-yellow-500/10" 
                    : "border-border/20 bg-card/10 opacity-70 hover:opacity-100"
                }`}
              >
                {/* Achievement Icon */}
                <div className={`relative shrink-0 size-14 rounded-md overflow-hidden border border-border transition-colors bg-black/40 ${
                  achieve.achieved ? "group-hover:border-yellow-500/30" : "grayscale opacity-50"
                }`}>
                  <img
                    src={achieve.icon}
                    alt={achieve.name}
                    className="size-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <h3 className={`truncate text-sm font-bold transition-colors ${
                    achieve.achieved ? "text-foreground group-hover:text-yellow-500" : "text-muted-foreground"
                  }`} title={achieve.name}>
                    {achieve.name}
                  </h3>
                  
                  {achieve.achieved ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Unlocked on {new Date(achieve.unlockTime! * 1000).toLocaleDateString()}
                    </p>
                  ) : (
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground/60">
                      <Lock className="size-3" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}