import { getProviders } from "next-auth/react";
import SignInButton from "./SignInButton";

export default async function SignIn() {
  const providers = await getProviders();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {providers &&
            Object.values(providers).map((provider) => (
              <SignInButton key={provider.id} provider={provider} />
            ))}
        </div>
      </div>
    </div>
  );
} 