"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/user.actions";
import { Loader2Icon } from "lucide-react";

function FollowButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      const result = await toggleFollow(userId);

      if (result?.success) {
        toast.success("Followed user successfully");
      }
    } catch (error) {
      toast.error("Something went wrong while following user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      onClick={handleFollow}
      disabled={isLoading}
      className="w-20"
    >
      {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Follow"}
    </Button>
  );
}

export default FollowButton;
