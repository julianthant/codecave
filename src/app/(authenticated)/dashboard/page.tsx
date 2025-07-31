import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserMenu } from "@/components/auth/user-menu";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserMenu />
      </div>
      <div className="grid gap-6">
        <div className="bg-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
          <p className="text-muted-foreground">
            Hello {data.user.email}, you&apos;re successfully authenticated.
          </p>
        </div>
      </div>
    </div>
  );
}
