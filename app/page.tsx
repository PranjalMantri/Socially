import ModeToggle from "@/components/ModeToggle";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>

      <ModeToggle />
    </div>
  );
}
