import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEMO_USER, useApp, type UserRole } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — VoxShield AI Voice Security Console" },
      {
        name: "description",
        content:
          "Sign in to the VoxShield AI voice integrity console, or open the demo account to explore the full detection workflow.",
      },
      { property: "og:title", content: "Sign in — VoxShield AI" },
      { property: "og:description", content: "Access the VoxShield AI voice fraud detection console." },
    ],
  }),
  component: AuthPage,
});

const ROLES: UserRole[] = ["Security Analyst", "Bank Employee", "Administrator", "Enterprise User"];

function AuthPage() {
  const { signIn, user, hydrated } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<null | "login" | "signup" | "demo">(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Security Analyst");

  useEffect(() => {
    if (hydrated && user) void navigate({ to: "/app", replace: true });
  }, [hydrated, user, navigate]);

  const enter = (mode: "login" | "signup" | "demo", payload: Parameters<typeof signIn>[0]) => {
    setBusy(mode);
    setTimeout(() => {
      signIn(payload);
      toast.success(mode === "demo" ? "Demo session started." : "Signed in successfully.");
      void navigate({ to: "/app" });
    }, 600);
  };

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="pointer-events-none absolute inset-0 aurora opacity-60" aria-hidden />

      <aside className="relative hidden flex-col justify-between border-r border-border p-10 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-bold">VoxShield AI</span>
        </Link>
        <div>
          <h2 className="max-w-md font-display text-3xl font-bold leading-tight">
            Detect AI-generated voices before they become real-world threats.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Six detection layers — acoustic, spectral, prosody, behavioural, speaker consistency and
            contextual risk — are fused into a single impersonation risk score with an explainable
            breakdown for every call.
          </p>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          Prototype build for Smart India Hackathon 2026 (SIH26104). Detection results are risk
          indicators, not proof of synthetic speech.
        </p>
      </aside>

      <main className="relative flex items-center justify-center p-6 sm:p-10">
        <div className="glass w-full max-w-md rounded-2xl p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold">Voice Security Console</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with your organisation account or explore the demo workspace.
          </p>

          <Button
            variant="hero"
            className="mt-5 w-full"
            onClick={() => enter("demo", DEMO_USER)}
            disabled={busy !== null}
          >
            {busy === "demo" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
            Continue with demo account
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <Tabs defaultValue="login">
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">
                Sign up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-5">
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!loginEmail || !loginPassword) {
                    toast.error("Enter your email and password to continue.");
                    return;
                  }
                  enter("login", {
                    name: loginEmail.split("@")[0]?.replace(/\W/g, " ") || "Analyst",
                    email: loginEmail,
                    organization: "Meridian National Bank",
                    role: "Security Analyst",
                    isDemo: false,
                  });
                }}
              >
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    placeholder="analyst@bank.in"
                    className="mt-1.5 bg-background/60"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 bg-background/60"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy !== null}>
                  {busy === "login" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                  Sign in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-5">
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!name || !email || !password) {
                    toast.error("Name, email and password are required.");
                    return;
                  }
                  enter("signup", {
                    name,
                    email,
                    organization: organization || "Independent",
                    role,
                    isDemo: false,
                  });
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 bg-background/60" />
                  </div>
                  <div>
                    <Label htmlFor="org">Organisation</Label>
                    <Input
                      id="org"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="mt-1.5 bg-background/60"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 bg-background/60"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5 bg-background/60"
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <SelectTrigger className="mt-1.5 bg-background/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={busy !== null}>
                  {busy === "signup" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-xs text-muted-foreground">
            Accounts in this prototype are stored locally in your browser — no credentials are sent
            anywhere.
          </p>
        </div>
      </main>
    </div>
  );
}
