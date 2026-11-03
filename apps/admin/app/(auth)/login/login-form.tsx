"use client";

import { Button } from "@b2c/ui/components/button";
import { Input } from "@b2c/ui/components/input";
import { Label } from "@b2c/ui/components/label";
import { Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const firstNames = ["alex", "sam", "jordan", "taylor", "casey", "riley", "morgan", "jamie"];

function randomDetails() {
  const name = firstNames[Math.floor(Math.random() * firstNames.length)]!;
  const n = Math.floor(100 + Math.random() * 900);
  return {
    email: `${name}.${n}@b2commerce.test`,
    password: Math.random().toString(36).slice(2, 12),
  };
}

/**
 * UI-testing sign-in: accepts any details and goes straight to the dashboard.
 * Nothing is sent anywhere. Replace `onSubmit` with a call to the apps/server
 * auth endpoint (and set the session cookie checked in proxy.ts) once auth exists.
 */
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        router.push("/dashboard/ecommerce");
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          const d = randomDetails();
          setEmail(d.email);
          setPassword(d.password);
        }}
      >
        <Shuffle />
        Fill random details
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Test mode — any email and password will sign you in.
      </p>
    </form>
  );
}
