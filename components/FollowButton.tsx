"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/user.action";

function FollowButton({ userId }: { userId: string }) {
  const [isLoading, setisLoading] = useState(false);

  const handleClick = async () => {
    setisLoading(true);
    try {
      await toggleFollow(userId);
      toast.success("Followed successfuly");
    } catch (error) {
      toast.error("Failed to follow");
    } finally {
      setisLoading(false);
    }
  };

  return (
    <Button
      variant={"secondary"}
      size={"sm"}
      onClick={handleClick}
      disabled={isLoading}
      className="w-20"
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Follow"}
    </Button>
  );
}

export default FollowButton;
