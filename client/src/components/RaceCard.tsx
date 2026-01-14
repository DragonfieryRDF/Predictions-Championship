import { format } from "date-fns";
import type { Race, Driver } from "@shared/schema";
import { MapPin, Calendar, Flag, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface RaceCardProps {
  race: Race & { p1Driver?: Driver | null, p2Driver?: Driver | null, p3Driver?: Driver | null };
  isNext?: boolean;
}

export function RaceCard({ race, isNext }: RaceCardProps) {
  const isFinished = !!race.p1DriverId;
  const raceDate = new Date(race.date);

  return (
    <div className={cn(
      "relative group overflow-hidden rounded-2xl border transition-all duration-300",
      isNext 
        ? "border-primary/50 bg-gradient-to-br from-card to-primary/5 shadow-2xl shadow-primary/10 scale-[1.01]" 
        : "border-border/50 bg-card hover:border-border hover:shadow-lg"
    )}>
      {isNext && (
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl font-display tracking-wider">
          UPCOMING
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary font-mono text-xs mb-2">
              <span className="font-bold">ROUND {race.round}</span>
              {race.hasSprint && (
                <span className="px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary border border-primary/20">SPRINT</span>
              )}
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-1 leading-none">
              {race.name}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-3 h-3" />
              {race.circuit}, {race.country}
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-white font-medium mb-1">
              <Calendar className="w-4 h-4 text-primary" />
              {format(raceDate, "dd MMM")}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(raceDate, "HH:mm")}
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-4">
          {isFinished ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground mb-2">
                <Trophy className="w-3 h-3 text-yellow-500" />
                Podium Results
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/5 rounded p-2 text-center border border-white/5">
                  <span className="block text-xs text-yellow-500 font-bold mb-1">P1</span>
                  <span className="text-sm font-bold truncate block">{race.p1Driver?.name || "-"}</span>
                </div>
                <div className="bg-white/5 rounded p-2 text-center border border-white/5">
                  <span className="block text-xs text-gray-400 font-bold mb-1">P2</span>
                  <span className="text-sm font-bold truncate block">{race.p2Driver?.name || "-"}</span>
                </div>
                <div className="bg-white/5 rounded p-2 text-center border border-white/5">
                  <span className="block text-xs text-orange-400 font-bold mb-1">P3</span>
                  <span className="text-sm font-bold truncate block">{race.p3Driver?.name || "-"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground italic">
                Predictions open until qualifying starts
              </span>
              <Link href="/predictions">
                <button className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-all text-sm uppercase tracking-wide shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0">
                  Predict Now
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
