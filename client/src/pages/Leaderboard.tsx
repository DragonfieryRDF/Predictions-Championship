import { useLeaderboard } from "@/hooks/use-predictions";
import { Loader2, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
          CHAMPIONSHIP STANDINGS
        </h1>
        <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
      </div>

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-left">
                <th className="px-6 py-4 font-display text-sm font-bold text-muted-foreground uppercase tracking-wider w-20 text-center">Pos</th>
                <th className="px-6 py-4 font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">Driver (User)</th>
                <th className="px-6 py-4 font-display text-sm font-bold text-muted-foreground uppercase tracking-wider text-center">Matches</th>
                <th className="px-6 py-4 font-display text-sm font-bold text-white uppercase tracking-wider text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {leaderboard?.map((entry, index) => {
                const isTop3 = index < 3;
                return (
                  <tr 
                    key={entry.userId} 
                    className={cn(
                      "group transition-colors hover:bg-white/5",
                      index === 0 && "bg-gradient-to-r from-yellow-500/5 to-transparent"
                    )}
                  >
                    <td className="px-6 py-4 text-center">
                      <div className={cn(
                        "font-display font-bold text-lg w-8 h-8 flex items-center justify-center rounded mx-auto",
                        index === 0 ? "text-yellow-500 bg-yellow-500/10" :
                        index === 1 ? "text-gray-300 bg-gray-300/10" :
                        index === 2 ? "text-orange-400 bg-orange-400/10" :
                        "text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" 
                          style={{ color: entry.color, backgroundColor: entry.color }}
                        />
                        <span className="font-bold text-lg text-white group-hover:text-primary transition-colors">
                          {entry.username}
                        </span>
                        {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                        <Medal className="w-3 h-3" />
                        {entry.exactMatches} Perfect
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-display font-bold text-2xl text-white">
                        {entry.totalPoints}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1 uppercase">PTS</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
