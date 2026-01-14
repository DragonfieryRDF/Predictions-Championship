import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type Driver } from "@shared/routes";
import { z } from "zod";

// Get List of Drivers
export function useDrivers() {
  return useQuery({
    queryKey: [api.drivers.list.path],
    queryFn: async () => {
      const res = await fetch(api.drivers.list.path);
      if (!res.ok) throw new Error("Failed to fetch drivers");
      return api.drivers.list.responses[200].parse(await res.json());
    },
  });
}

// Get List of Races
export function useRaces() {
  return useQuery({
    queryKey: [api.races.list.path],
    queryFn: async () => {
      const res = await fetch(api.races.list.path);
      if (!res.ok) throw new Error("Failed to fetch races");
      return api.races.list.responses[200].parse(await res.json());
    },
  });
}

// Get Single Race
export function useRace(id: number) {
  return useQuery({
    queryKey: [api.races.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.races.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch race");
      return api.races.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Set Race Results (Admin)
export function useSetRaceResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, results }: { id: number, results: { p1DriverId: number, p2DriverId: number, p3DriverId: number } }) => {
      const url = buildUrl(api.races.setResults.path, { id });
      const res = await fetch(url, {
        method: api.races.setResults.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(results),
      });
      if (!res.ok) throw new Error("Failed to set results");
      return api.races.setResults.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.races.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.leaderboard.list.path] });
    },
  });
}
