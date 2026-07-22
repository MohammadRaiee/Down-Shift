"use client";

import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mergeGuestCartAfterLogin } from "@/lib/guestCartMerge";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(password, email, "password and email");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setIsLoading(false);
      setDialogMessage(res.error);
      setDialogOpen(true);
    } else {
      await mergeGuestCartAfterLogin();
      setIsLoading(false);
      router.push("/");
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    const res = await signOut({ redirect: false });
    setIsLoading(false);
    if (res?.url) {
        router.push(res.url);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-[1.75rem] border border-zinc-800 bg-zinc-950/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-7"
        >
          {/* Header Section */}
          <div className="mb-6 border-b border-zinc-800 pb-5 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-red-400">
              Welcome Back
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Login
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Inputs Section */}
          <div className="space-y-4">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20"
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20"
            />

            {/* Login Button */}
            <Button
              disabled={isLoading}
              type="submit"
              className="h-12 w-full rounded-xl bg-red-600 text-white transition-all duration-300 hover:bg-red-500 hover:shadow-[0_0_24px_rgba(220,38,38,0.35)]"
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              type="button"
              disabled={isLoading}
              variant="outline"
              className="h-12 w-full rounded-xl border border-zinc-800 bg-transparent text-zinc-400 transition-all duration-300 hover:bg-white/5 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </form>
      </div>

      <AlertDialog
        open={dialogOpen}
        mainText={dialogMessage || "Something went wrong"}
        button1Text="Close"
        button2Text="Try again"
        callbackFunction={() => setDialogOpen(false)}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}