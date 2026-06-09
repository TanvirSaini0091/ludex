import { useState, useEffect, useMemo } from "react"
import { Search, UserCircle, Gamepad2, Users } from "lucide-react"

// Types
interface Friend {
  steamid: string
  name: string
  avatar: string
  state: number
  gameInfo: string | null
}

export const FriendsTab = () => {
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("/api/steam/friends")
        if (res.ok) {
          const data = await res.json()
          setFriends(data)
        }
      } catch (error) {
        console.error("Failed to fetch friends:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFriends()
  }, [])

  // Quick search filter
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends
    const query = searchQuery.toLowerCase()
    return friends.filter((f) => f.name.toLowerCase().includes(query))
  }, [friends, searchQuery])

  // Helper to map Steam's state integers to UI colors and text
  const getStatusDisplay = (state: number, gameInfo: string | null) => {
    if (gameInfo) {
      return { text: "In-Game", color: "bg-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" }
    }
    switch (state) {
      case 1: return { text: "Online", color: "bg-blue-400" }
      case 2: return { text: "Busy", color: "bg-destructive" }
      case 3: return { text: "Away", color: "bg-yellow-400" }
      case 4: return { text: "Snooze", color: "bg-yellow-600" }
      default: return { text: "Offline", color: "bg-muted-foreground" }
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] flex flex-col h-[calc(100vh-120px)] space-y-6">
      
      {/* ── Header Controls ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="size-6 text-primary" />
            Friends List
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? "Syncing network..." : `${friends.length} friends connected`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-border/50 bg-black/20 pr-3 pl-9 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none backdrop-blur-sm"
          />
        </div>
      </div>

      {/* ── Friends Grid ── */}
      <div className="flex-1 overflow-y-auto pr-2 pb-8 custom-scrollbar">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm font-medium tracking-wide">Pinging Steam Network...</p>
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground rounded-xl border border-dashed border-border/50 bg-card/10 p-12">
            <UserCircle className="size-12 opacity-20" />
            <p className="text-base font-medium text-foreground">No friends found</p>
            <p className="text-sm">They might be hiding offline.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-1">
            {filteredFriends.map((friend) => {
              const status = getStatusDisplay(friend.state, friend.gameInfo)
              
              return (
                <div
                  key={friend.steamid}
                  className="group relative flex items-center gap-4 rounded-xl border border-border/50 bg-card/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/10 backdrop-blur-sm"
                >
                  {/* Avatar with Status Indicator */}
                  <div className="relative shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className={`size-14 rounded-md border-2 transition-colors ${
                        friend.gameInfo ? 'border-primary' : 'border-transparent'
                      }`}
                      onError={(e) => {
                        e.currentTarget.src = 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg' // Default ? avatar
                      }}
                    />
                    <div 
                      className={`absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-background ${status.color}`} 
                      title={status.text}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <h3 className="truncate text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      {friend.name}
                    </h3>
                    
                    {friend.gameInfo ? (
                      <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-primary">
                        <Gamepad2 className="size-3.5 shrink-0" />
                        <span className="truncate">{friend.gameInfo}</span>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {status.text}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}