import { useRaces, useDrivers } from "@/hooks/use-races";
import { useAuth } from "@/hooks/use-auth";
import { RaceCard } from "@/components/RaceCard";
import { Loader2, AlertCircle } from "lucide-react";
import { isAfter } from "date-fns";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: races, isLoading, error } = useRaces();
  
  // Find next race
  const nextRace = races?.find(race => isAfter(new Date(race.date), new Date()));
  const pastRaces = races?.filter(race => !isAfter(new Date(race.date), new Date())).reverse().slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-destructive">
        <AlertCircle className="w-8 h-8 mr-2" />
        <span className="text-lg">Failed to load races data</span>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-primary/5 to-transparent border-b border-border/50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary">
            Welcome back, {user?.username}
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white">
            RACE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">WEEK</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Predict the podium for every race of the 2026 season and compete against friends for the championship title.
          </p>
          
          <div className="pt-4 flex justify-center gap-4">
             <Link href="/predictions">
               <button className="bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                 Make Predictions
               </button>
             </Link>
             <Link href="/leaderboard">
               <button className="bg-secondary hover:bg-secondary/80 text-white font-bold text-lg py-4 px-8 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                 View Standings
               </button>
             </Link>
          </div>
        </div>
      </section>

      {/* Next Race */}
      {nextRace && (
        <section className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
             <div className="h-px bg-border flex-1" />
             <h2 className="text-2xl font-display font-bold text-white">UPCOMING SESSION</h2>
             <div className="h-px bg-border flex-1" />
          </div>
          <RaceCard race={nextRace} isNext={true} />
        </section>
      )}

      {/* Recent Results */}
      {pastRaces && pastRaces.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-2xl font-display font-bold text-white mb-6">RECENT RESULTS</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastRaces.map(race => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
