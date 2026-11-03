"use client";

import { Package, Shuffle, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { lastOrderStore } from "@/app/(checkout)/order/[id]/order-store";
import { cn } from "@/lib/utils";

/*
 * UI-testing auth: any details sign you in. Nothing is sent anywhere — the
 * "session" is just the name/email kept in localStorage so the account page
 * can show a signed-in state. Replace `signIn`/`signOut` with calls to the
 * apps/server auth endpoints once they exist.
 */

type DemoUser = { name: string; email: string };
const KEY = "b2c-demo-user";
const EVENT = "b2c-demo-user-change";

const userStore = {
  subscribe(cb: () => void) {
    window.addEventListener(EVENT, cb);
    window.addEventListener("storage", cb);
    return () => {
      window.removeEventListener(EVENT, cb);
      window.removeEventListener("storage", cb);
    };
  },
  getSnapshot: () => localStorage.getItem(KEY),
  getServerSnapshot: () => null,
};

function signIn(user: DemoUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(EVENT));
}
function signOut() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

const first = ["Alex", "Sam", "Jordan", "Taylor", "Casey", "Riley", "Morgan", "Jamie"];
const last = ["Lee", "Patel", "Kim", "Garcia", "Nguyen", "Smith", "Rossi", "Khan"];
const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)]!;

function randomDetails() {
  const name = `${pick(first)} ${pick(last)}`;
  return {
    name,
    email: `${name.toLowerCase().replace(" ", ".")}${Math.floor(10 + Math.random() * 90)}@example.test`,
    password: Math.random().toString(36).slice(2, 12),
  };
}

const field =
  "mt-2 h-12 w-full rounded-lg border border-border bg-background px-4 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-ring";

export function AccountForm() {
  const raw = useSyncExternalStore(userStore.subscribe, userStore.getSnapshot, userStore.getServerSnapshot);
  const user = raw ? (JSON.parse(raw) as DemoUser) : null;
  return user ? <SignedIn user={user} /> : <SignInForm />;
}

function SignInForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h1 className="text-center text-3xl font-medium tracking-tight">{mode === "signin" ? "Welcome back" : "Create an account"}</h1>
      <p className="mt-2 text-center text-muted-foreground">
        {mode === "signin" ? "Sign in to track orders and check out faster." : "Save your details and track every order."}
      </p>

      <div className="mt-8 grid grid-cols-2 rounded-full bg-secondary p-1">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "h-9 rounded-full text-sm font-medium transition-colors",
              mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            {m === "signin" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn({ name: name.trim() || email.split("@")[0]!, email });
        }}
        className="mt-6 space-y-4"
      >
        {mode === "signup" && (
          <label className="block text-sm font-medium">
            Full name
            <input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
          </label>
        )}
        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            required
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
        </label>
        <button
          type="submit"
          className="h-12 w-full rounded-full bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button
          type="button"
          onClick={() => {
            const d = randomDetails();
            setName(d.name);
            setEmail(d.email);
            setPassword(d.password);
          }}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border font-medium transition-colors hover:bg-secondary"
        >
          <Shuffle className="h-4 w-4" />
          Fill random details
        </button>
        <p className="text-center text-xs text-muted-foreground">Test mode — any details will sign you in.</p>
      </form>
    </div>
  );
}

function SignedIn({ user }: { user: DemoUser }) {
  const lastOrder = useSyncExternalStore(lastOrderStore.subscribe, lastOrderStore.getSnapshot, lastOrderStore.getServerSnapshot);
  let lastOrderId: string | null = null;
  try {
    lastOrderId = lastOrder ? (JSON.parse(lastOrder) as { id?: string }).id ?? null : null;
  } catch {
    lastOrderId = null;
  }

  const tile = "flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-secondary";

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <UserRound className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">Hi, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-muted-foreground">{user.email}</p>
      </div>

      <div className="mt-8 space-y-3">
        {lastOrderId ? (
          <Link href={`/order/${lastOrderId}`} className={tile}>
            <Package className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Your latest order</div>
              <div className="text-sm text-muted-foreground">{lastOrderId}</div>
            </div>
          </Link>
        ) : (
          <div className={cn(tile, "hover:bg-transparent")}>
            <Package className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">No orders yet</div>
              <div className="text-sm text-muted-foreground">Orders you place will show up here.</div>
            </div>
          </div>
        )}
        <Link href="/products" className={tile}>
          <ShoppingBag className="h-5 w-5 text-primary" />
          <div>
            <div className="font-medium">Continue shopping</div>
            <div className="text-sm text-muted-foreground">Browse all products</div>
          </div>
        </Link>
      </div>

      <button
        type="button"
        onClick={signOut}
        className="mt-8 h-12 w-full rounded-full border border-border font-medium transition-colors hover:bg-secondary"
      >
        Sign out
      </button>
    </div>
  );
}
