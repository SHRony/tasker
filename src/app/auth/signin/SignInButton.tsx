"use client";

import { signIn } from "next-auth/react";
import { ClientSafeProvider } from "next-auth/react";

interface SignInButtonProps {
  provider: ClientSafeProvider;
}

export default function SignInButton({ provider }: SignInButtonProps) {
  return (
    <button
      onClick={() => signIn(provider.id)}
      className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Sign in with {provider.name}
    </button>
  );
} 