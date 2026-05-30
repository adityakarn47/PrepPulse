"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.action";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        toast.success(result.message);
        router.push("/sign-in");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("An error occurred during logout");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      title="Logout"
    >
      <LogOut className="h-4 w-4" />
      <span className="text-sm font-medium">Logout</span>
    </Button>
  );
};

export default LogoutButton;
