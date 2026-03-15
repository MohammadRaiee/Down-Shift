"use client";
import SignIn from '@/components/auth/signIn'
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from 'next-auth/react';

export default function Login() {
 
  return (
<>
<SignIn/></>
  );
}