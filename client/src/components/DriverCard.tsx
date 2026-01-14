import { cn } from "@/lib/utils";
import type { Driver } from "@shared/schema";

interface DriverCardProps {
  driver: Driver;
  position?: "P1" | "P2" | "P3";
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function DriverCard({ driver, position, selected, onClick, className }: DriverCardProps) {
  const getPositionColor = (pos?: string) => {
    switch(pos) {
      case "P1": return "text-yellow-400 border-yellow-400/50 bg-yellow-400/10";
      case "P2": return "text-gray-300 border-gray-300/50 bg-gray-300/10";
      case "P3": return "text-orange-400 border-orange-400/50 bg-orange-400/10";
      default: return "text-muted-foreground border-border bg-card";
    }
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 transition-all duration-300 cursor-pointer group",
        selected 
          ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(255,24,1,0.15)] scale-[1.02]" 
          : "border-border/50 bg-card hover:border-primary/50 hover:bg-card/80",
        className
      )}
    >
      {/* Team Color Strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
      
      <div className="flex items-center justify-between pl-3">
        <div className="flex flex-col">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-0.5">
            {driver.team}
          </span>
          <span className="font-display text-lg font-bold leading-none tracking-tight">
            {driver.name}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
            {driver.number}
          </span>
          {position && (
             <div className={cn(
               "w-8 h-8 flex items-center justify-center rounded-lg font-bold font-display border",
               getPositionColor(position)
             )}>
               {position}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
