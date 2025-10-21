import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.action";
import ProfilePageClient from "@/components/ProfilePageClient";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  const user = await getProfileByUsername(username);
  if (!user) return;

  return {
    title: user.name,
    description: user.bio || "",
  };
}

async function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = await params;

  const user = await getProfileByUsername(username);
  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}

export default ProfilePage;
