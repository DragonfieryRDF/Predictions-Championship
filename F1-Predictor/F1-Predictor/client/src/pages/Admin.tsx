import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRaces, useDrivers, useSetRaceResults } from "@/hooks/use-races";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { user } = useAuth();
  const { data: races, isLoading: loadingRaces } = useRaces();
  const { data: drivers, isLoading: loadingDrivers } = useDrivers();
  const setResultsMutation = useSetRaceResults();
  const { toast } = useToast();

  const [selectedRaceId, setSelectedRaceId] = useState<string>("");
  const [p1, setP1] = useState<string>("");
  const [p2, setP2] = useState<string>("");
  const [p3, setP3] = useState<string>("");

  if (loadingRaces || loadingDrivers) return <div className="p-8 text-center text-muted-foreground">Loading admin data...</div>;
  if (!user?.isAdmin) return <div className="p-8 text-center text-destructive font-bold text-xl">Unauthorized Access</div>;

  const handleSave = async () => {
    if (!selectedRaceId || !p1 || !p2 || !p3) return;
    try {
      await setResultsMutation.mutateAsync({
        id: parseInt(selectedRaceId),
        results: {
          p1DriverId: parseInt(p1),
          p2DriverId: parseInt(p2),
          p3DriverId: parseInt(p3),
        }
      });
      toast({ title: "Results updated", description: "Points have been recalculated." });
      // Reset
      setP1(""); setP2(""); setP3(""); setSelectedRaceId("");
    } catch (e) {
      toast({ title: "Error", description: "Failed to update results", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-card border border-destructive/20 rounded-xl p-8 space-y-8 shadow-2xl">
        <div className="border-b border-border pb-4">
          <h1 className="text-3xl font-display font-bold text-white">ADMIN CONSOLE</h1>
          <p className="text-muted-foreground">Input official race results to calculate scores.</p>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium">Select Race to Grade</label>
          <Select value={selectedRaceId} onValueChange={setSelectedRaceId}>
            <SelectTrigger>
              <SelectValue placeholder="Select completed race..." />
            </SelectTrigger>
            <SelectContent>
              {races?.map((r) => (
                <SelectItem key={r.id} value={r.id.toString()}>
                  R{r.round}: {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRaceId && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-yellow-500 uppercase">P1 Winner</label>
                <Select value={p1} onValueChange={setP1}>
                  <SelectTrigger className="border-l-4 border-l-yellow-500">
                    <SelectValue placeholder="Driver..." />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers?.map(d => (
                      <SelectItem key={d.id} value={d.id.toString()}>{d.number} - {d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">P2 Second</label>
                <Select value={p2} onValueChange={setP2}>
                  <SelectTrigger className="border-l-4 border-l-gray-400">
                    <SelectValue placeholder="Driver..." />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers?.map(d => (
                      <SelectItem key={d.id} value={d.id.toString()}>{d.number} - {d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-orange-400 uppercase">P3 Third</label>
                <Select value={p3} onValueChange={setP3}>
                  <SelectTrigger className="border-l-4 border-l-orange-400">
                    <SelectValue placeholder="Driver..." />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers?.map(d => (
                      <SelectItem key={d.id} value={d.id.toString()}>{d.number} - {d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={setResultsMutation.isPending}
              className="w-full h-12 text-lg bg-destructive hover:bg-destructive/90 text-white font-bold"
            >
              {setResultsMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-5 h-5" />}
              Save Official Results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
