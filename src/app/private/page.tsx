import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "../auth/login/actions";
import { Button } from "@/components/ui/button";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <p>Hello {data.user.email}</p>
      <form className={cn("flex flex-col gap-6")}>
        <Button formAction={signOut}>Sign Out</Button>
      </form>
    </div>
  );
}
