"use client";

import { MoreVertical, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserInfo from "./UserInfo";
import LogoutButton from "./LogoutButton";
import { useEffect, useState } from "react";
import { getDailyUsage } from "@/lib/actions/general.actions";

interface NavigationMenuProps {
  userName?: string;
  userId?: string;
}

const NavigationMenu = ({ userName, userId }: NavigationMenuProps) => {
  const [usage, setUsage] = useState<{
    remaining: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!userId) return;
      const data = await getDailyUsage(userId);
      if (mounted) setUsage({ remaining: data.remaining, limit: data.limit });
    };
    load();

    const onChanged = () => load();
    window.addEventListener("usage:changed", onChanged);
    return () => {
      mounted = false;
      window.removeEventListener("usage:changed", onChanged);
    };
  }, [userId]);

  return (
    <>
      {/* Desktop/Tablet View */}
      <div className="hidden md:flex items-center gap-4">
        <div className="text-xs text-muted-foreground bg-dark-200 rounded-md py-1 px-2">
          Calls: {usage ? `${usage.remaining}/${usage.limit}` : "-/-"}
        </div>
        <UserInfo userName={userName} />
        <LogoutButton />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="flex flex-col gap-2">
              <div className="px-2 py-1 capitalize flex items-center gap-2 text-ellipsis overflow-hidden">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {userName || "User"}
                </span>
              </div>
              <div className="px-2 py-1 text-xs text-muted-foreground">
                Calls: {usage ? `${usage.remaining}/${usage.limit}` : "-/-"}
              </div>
              <div className="border-t pt-2">
                <LogoutButton />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default NavigationMenu;
