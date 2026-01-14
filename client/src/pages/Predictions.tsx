import { useState } from "react";
import { useRaces, useDrivers } from "@/hooks/use-races";
import { usePredictions } from "@/hooks/use-predictions";
import { Loader2, CheckCircle2, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Predictions() {
  const { data: races, isLoading: loadingRaces } = useRaces();
  const { data: drivers, isLoading: loadingDrivers } = useDrivers();
  const { myPredictions, createPrediction } = usePredictions();
  
  const [selectedRaceId, setSelectedRaceId] = useState<string>("");
  const [p1, setP1] = useState<string>("");
  const [p2, setP2] = useState<string>("");
  const [p3, setP3] = useState<string>("");

  const isLoading = loadingRaces || loadingDrivers;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // Filter for upcoming races only
  const upcomingRaces = races?.filter(r => new Date(r.date) > new Date()) || [];
  
  // Get active selected race details
  const activeRace = races?.find(r => r.id.toString() === selectedRaceId);
  
  // Check if already predicted
  const existingPrediction = myPredictions?.find(p => p.raceId.toString() === selectedRaceId);

  const handleSubmit = async () => {
    if (!selectedRaceId || !p1 || !p2 || !p3) return;
    
    await createPrediction.mutateAsync({
      raceId: parseInt(selectedRaceId),
      p1DriverId: parseInt(p1),
      p2DriverId: parseInt(p2),
      p3DriverId: parseInt(p3),
    });
    
    // Reset form
    setP1(""); setP2(""); setP3("");
  };

  const getDriverName = (id: string) => drivers?.find(d => d.id.toString() === id)?.name;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-white mb-2">SUBMIT PREDICTIONS</h1>
        <p className="text-muted-foreground">Select a race and pick your Top 3 finishers.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Selection Form */}
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-medium text-white uppercase tracking-wider">Select Race Weekend</label>
            <Select value={selectedRaceId} onValueChange={setSelectedRaceId}>
              <SelectTrigger className="h-14 bg-card border-border text-lg font-display">
                <SelectValue placeholder="Choose a race..." />
              </SelectTrigger>
              <SelectContent>
                {upcomingRaces.map((race) => (
                  <SelectItem key={race.id} value={race.id.toString()}>
                    <span className="font-bold mr-2">R{race.round}:</span> {race.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeRace && (
            <div className="space-y-6 pt-4 border-t border-border/50">
              <div className="flex items-center gap-4 text-sm text-primary">
                <span className="font-bold">{activeRace.circuit}</span>
                <span>•</span>
                <span>{format(new Date(activeRace.date), "dd MMM HH:mm")}</span>
              </div>

              {existingPrediction ? (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Prediction Locked!</h3>
                  <p className="text-muted-foreground mb-6">You have already submitted predictions for this race.</p>
                  
                  <div className="space-y-3 max-w-xs mx-auto">
                    <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg">
                      <span className="font-bold text-yellow-500">P1</span>
                      <span className="text-white font-medium">{getDriverName(existingPrediction.p1DriverId.toString())}</span>
                    </div>
                    <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg">
                      <span className="font-bold text-gray-400">P2</span>
                      <span className="text-white font-medium">{getDriverName(existingPrediction.p2DriverId.toString())}</span>
                    </div>
                    <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg">
                      <span className="font-bold text-orange-400">P3</span>
                      <span className="text-white font-medium">{getDriverName(existingPrediction.p3DriverId.toString())}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-yellow-500 uppercase">
                      <Trophy className="w-4 h-4" /> Winner (P1)
                    </label>
                    <Select value={p1} onValueChange={setP1}>
                      <SelectTrigger className="h-12 bg-card border-l-4 border-l-yellow-500">
                        <SelectValue placeholder="Select Driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers?.map((d) => (
                          <SelectItem key={d.id} value={d.id.toString()} disabled={p2 === d.id.toString() || p3 === d.id.toString()}>
                            <span className="font-mono text-muted-foreground w-6 inline-block">{d.number}</span> 
                            {d.name} <span className="text-muted-foreground text-xs ml-2">({d.team})</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-300 uppercase">
                      <Trophy className="w-4 h-4" /> Runner Up (P2)
                    </label>
                    <Select value={p2} onValueChange={setP2}>
                      <SelectTrigger className="h-12 bg-card border-l-4 border-l-gray-300">
                        <SelectValue placeholder="Select Driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers?.map((d) => (
                          <SelectItem key={d.id} value={d.id.toString()} disabled={p1 === d.id.toString() || p3 === d.id.toString()}>
                            <span className="font-mono text-muted-foreground w-6 inline-block">{d.number}</span> 
                            {d.name} <span className="text-muted-foreground text-xs ml-2">({d.team})</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-orange-400 uppercase">
                      <Trophy className="w-4 h-4" /> Third Place (P3)
                    </label>
                    <Select value={p3} onValueChange={setP3}>
                      <SelectTrigger className="h-12 bg-card border-l-4 border-l-orange-400">
                        <SelectValue placeholder="Select Driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers?.map((d) => (
                          <SelectItem key={d.id} value={d.id.toString()} disabled={p1 === d.id.toString() || p2 === d.id.toString()}>
                            <span className="font-mono text-muted-foreground w-6 inline-block">{d.number}</span> 
                            {d.name} <span className="text-muted-foreground text-xs ml-2">({d.team})</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full h-14 text-lg font-bold font-display uppercase tracking-wider mt-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    onClick={handleSubmit}
                    disabled={!p1 || !p2 || !p3 || createPrediction.isPending}
                  >
                    {createPrediction.isPending ? "Submitting..." : "Lock In Prediction"}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Info / Visuals */}
        <div className="hidden lg:flex flex-col justify-center items-center text-center space-y-8 opacity-50">
          <div className="w-64 h-64 rounded-full border-4 border-dashed border-border flex items-center justify-center">
            <Trophy className="w-24 h-24 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">SCORING SYSTEM</h3>
            <ul className="text-left space-y-3 text-muted-foreground max-w-xs mx-auto">
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-500 font-bold border border-green-500/30">2</span>
                <span>Points for exact position</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 font-bold border border-blue-500/30">1</span>
                <span>Point for driver in Top 3</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
