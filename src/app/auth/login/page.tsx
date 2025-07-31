import { LogoBlack } from "@/components/ui/logo";
import { AuthButton } from "@/components/auth/auth-button";
import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 bg-muted p-6 md:p-10 min-h-svh">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <Link
          href="/"
          className="flex items-center self-center gap-2 font-medium"
        >
          <LogoBlack />
        </Link>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome to CodeCave</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Join the developer revolution!
            </p>
          </div>
          <div className="space-y-3">
            <AuthButton provider="github" redirectTo="/dashboard" />
            <AuthButton provider="google" redirectTo="/dashboard" />
            <AuthButton provider="discord" redirectTo="/dashboard" />
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <User className="mr-2 h-4 w-4" />
                Continue as Guest
              </Link>
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="#" className="underline hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
