interface GameRowProps {
  appId: number;
  name: string;
  iconUrl: string;
  recentPlaytime: number; // in minutes
  totalPlaytime: number; // in minutes
}

export const GameRow = ({ appId, name, iconUrl, recentPlaytime, totalPlaytime }: GameRowProps) => {
  return (
    <div className="group flex cursor-pointer items-center gap-5 px-6 py-4 transition-colors hover:bg-white/[0.02]">
      {/* SMALL ICON RENDERING */}
      <img
        src={`http://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${iconUrl}.jpg`}
        alt={name}
        className="size-10 shrink-0 rounded border border-border/50 bg-black/20 shadow-sm"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
          {name}
        </p>
        <p className="mt-0.5 text-xs tracking-wide text-muted-foreground">
          App ID: {appId}
        </p>
      </div>
      <div className="shrink-0 border-r border-border/50 px-4 text-right">
        <p className="text-sm font-medium text-foreground tabular-nums">
          {(recentPlaytime / 60).toFixed(1)}h
        </p>
        <p className="mt-0.5 text-[10px] tracking-widest text-muted-foreground uppercase">
          Recent
        </p>
      </div>
      <div className="w-20 shrink-0 text-right">
        <p className="text-sm font-medium text-foreground tabular-nums">
          {Math.round(totalPlaytime / 60)}h
        </p>
        <p className="mt-0.5 text-[10px] tracking-widest text-muted-foreground uppercase">
          Total
        </p>
      </div>
    </div>
  );
};
