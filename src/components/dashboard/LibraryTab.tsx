import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Clock,
  MoreVertical,
  Gamepad2,
  ArrowDownAZ,
  SortAsc,
} from "lucide-react"

// Types to help with autocompletion and safety
interface SteamGame {
  appid: number
  name: string
  playtime_forever: number
  img_icon_url: string
}

type SortOption = "playtime" | "alphabetical"

export const LibraryTab = () => {
  const [games, setGames] = useState<SteamGame[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("playtime")

  // Fetch the user's full library
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await fetch("/api/steam/library")
        if (res.ok) {
          const data = await res.json()
          setGames(data.games || [])
        }
      } catch (error) {
        console.error("Failed to fetch library:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLibrary()
  }, [])

  // Memoized derived state for searching and sorting
  const filteredAndSortedGames = useMemo(() => {
    let result = [...games]

    // 1. Apply Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((g) => g.name.toLowerCase().includes(query))
    }

    // 2. Apply Sort
    if (sortBy === "playtime") {
      result.sort((a, b) => b.playtime_forever - a.playtime_forever)
    } else if (sortBy === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [games, searchQuery, sortBy])

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-8">
      {/* ── Header Controls ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Your Library
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${games.length} games available`}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Find a game..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-border/50 bg-black/20 pr-3 pl-9 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none backdrop-blur-sm"
            />
          </div>

          {/* Sort Toggle */}
          <button
            onClick={() =>
              setSortBy(sortBy === "playtime" ? "alphabetical" : "playtime")
            }
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border/50 bg-card/40 px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground backdrop-blur-sm sm:w-auto"
            title={`Sorting by ${sortBy}`}
          >
            {sortBy === "playtime" ? (
              <SortAsc className="size-4 text-primary" />
            ) : (
              <ArrowDownAZ className="size-4 text-primary" />
            )}
            <span className="capitalize">{sortBy}</span>
          </button>
        </div>
      </div>

      {/* ── Game Grid ── */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm font-medium tracking-wide">
              Syncing Library Data...
            </p>
          </div>
        ) : filteredAndSortedGames.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/50 bg-card/10 p-12 text-center text-muted-foreground">
            <Gamepad2 className="size-12 opacity-20" />
            <p className="text-base font-medium text-foreground">
              No games found
            </p>
            <p className="text-sm">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 items-stretch">
            {filteredAndSortedGames.map((game) => (
              <div
                key={game.appid}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/10"
              >
                {/* Game Banner Image */}
                <div className="relative flex aspect-[460/215] w-full shrink-0 items-center justify-center bg-black/20 overflow-hidden">
                  
                  {/* Permanent Background Fallback (Only visible if the image fails completely) */}
                  <Gamepad2 className="absolute size-10 text-muted-foreground opacity-20" />
                  
                  <img
                    src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`}
                    alt={game.name}
                    className="relative z-10 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.currentTarget
                      
                      // Check if we already tried to load the fallback
                      if (target.getAttribute("data-error")) {
                        // If fallback also failed (e.g. Battlefield 6), hide the img tag completely
                        target.style.display = "none"
                        return
                      }
                      
                      // Trigger first fallback (e.g. Where Winds Meet)
                      target.setAttribute("data-error", "true")
                      target.src = `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
                      
                      // Use a fixed size instead of 'size-full' so it doesn't stretch and blur
                      target.className =
                        "relative z-10 size-16 object-contain opacity-40 rounded-md transition-transform duration-500 group-hover:scale-110 shadow-lg"
                    }}
                  />
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 text-base font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {game.name}
                  </h3>

                  {/* Footer */}
                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between border-t border-border/50 pt-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3.5 text-primary/70" />
                        <span className="font-medium tabular-nums text-foreground/80">
                          {Math.round(game.playtime_forever / 60)} hrs
                        </span>
                      </div>
                      <button className="text-muted-foreground transition-colors hover:text-foreground">
                        <MoreVertical className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}