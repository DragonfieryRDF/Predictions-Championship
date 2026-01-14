import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertPrediction } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function usePredictions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: myPredictions, isLoading } = useQuery({
    queryKey: [api.predictions.listMine.path],
    queryFn: async () => {
      const res = await fetch(api.predictions.listMine.path);
      if (!res.ok) throw new Error("Failed to fetch predictions");
      return api.predictions.listMine.responses[200].parse(await res.json());
    },
  });

  const createPrediction = useMutation({
    mutationFn: async (data: InsertPrediction) => {
      const res = await fetch(api.predictions.create.path, {
        method: api.predictions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit prediction");
      }
      return api.predictions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.predictions.listMine.path] });
      toast({
        title: "Prediction Locked In!",
        description: "Good luck for the race weekend.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    myPredictions,
    isLoading,
    createPrediction,
  };
}

export function useLeaderboard() {
  return useQuery({
    queryKey: [api.leaderboard.list.path],
    queryFn: async () => {
      const res = await fetch(api.leaderboard.list.path);
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return api.leaderboard.list.responses[200].parse(await res.json());
    },
  });
}
