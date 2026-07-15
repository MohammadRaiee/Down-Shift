"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from 'next-auth/react';
import { mergeGuestCartAfterLogin } from "@/lib/guestCartMerge";
import { AlertDialog } from "@/components/ui/alert-dialog";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading , setIsLoading]=useState(false)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true)
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
        setIsLoading(false)
      setDialogMessage(res.error);
      setDialogOpen(true);
    } 
    else {
        await mergeGuestCartAfterLogin();
        setIsLoading(false)
      router.push("/");
    }
  };

 const handleLogout = async () => {
    setIsLoading(true)
const res = await signOut({ redirect: false })
    setIsLoading(false)
router.push(res.url) 
 };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center min-h-screen space-y-4"  >
        <input
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="mx-19 border-2 border-cyan-950" disabled={isLoading} type="submit">{isLoading?"Loading":"Login"}</button>
        <button onClick={handleLogout} type="button" className="logout-btn border-2 border-cyan-950 ">
        Logout
      </button>
      </form>

      <AlertDialog
        open={dialogOpen}
        mainText={dialogMessage || "Something went wrong"}
        button1Text="Close"
        button2Text="Try again"
        callbackFunction={() => setDialogOpen(false)}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}