"use client";

import { User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserInfoProps {
  userName?: string;
}

const UserInfo = ({ userName }: UserInfoProps) => {
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 text-muted-foreground cursor-pointer">
            <User className="h-4 w-4" />
            <span className="font-medium">
              {userName ? getUserInitials(userName) : "U"}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{userName || "User"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserInfo;
