import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flag, Loader2 } from "lucide-react";
import { Link } from "wouter";

const PRESET_COLORS = [
  "#FF1801", // Ferrari Red
  "#00D2BE", // Mercedes Teal
  "#0600EF", // Red Bull Blue
  "#FF8700", // McLaren Orange
  "#005AFF", // Alpine Blue
  "#00A19B", // Aston Martin Green
];

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const { loginMutation, registerMutation } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      registerMutation.mutate({ username, password, color });
    } else {
      loginMutation.mutate({ username, password });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-card/95 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary skew-x-[-12deg] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
            <Flag className="w-8 h-8 text-white skew-x-[12deg]" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            F1 CHAMPIONSHIP
          </h1>
          <p className="text-muted-foreground mt-2">
            {isRegister ? "Create your driver profile" : "Sign in to your cockpit"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background/50 border-white/10 focus:border-primary/50"
              placeholder="MaxVerstappen1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 border-white/10 focus:border-primary/50"
              required
            />
          </div>

          {isRegister && (
            <div className="space-y-3">
              <Label>Team Color</Label>
              <div className="flex gap-2 justify-center">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-all ${color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold font-display uppercase tracking-wider bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isRegister ? "Join Championship" : "Start Engine"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-muted-foreground hover:text-white transition-colors"
          >
            {isRegister ? "Already have an account? Sign in" : "New rookie? Create account"}
          </button>
        </div>
      </div>
    </div>
  );
}
