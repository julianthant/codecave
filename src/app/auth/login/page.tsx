import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { LogoBlack } from "@/components/ui/logo";
import Link from "next/link";

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
        <LoginForm />
      </div>
    </div>
  );
}
