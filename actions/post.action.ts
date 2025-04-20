"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";
import { NotificationType } from "@prisma/client";

export async function createPost(content: string, imageUrl: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return { success: false, error: "User not found" };
    }

    const post = await prisma.post.create({
      data: {
        content: content,
        image: imageUrl,
        authorId: userId,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.log("Error in creat post: ", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.log("Error in getPosts: ", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function toggleLike(postId: string) {
  try {
    // get user id
    const userId = await getDbUserId();

    if (!userId) return;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // check if there is already a like
    const exisitingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });

    if (exisitingLike) {
      // if like - unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      });
    } else {
      // else like with notification
      prisma.$transaction([
        prisma.like.create({
          data: {
            postId: postId,
            userId: userId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: NotificationType.LIKE,
                  creatorId: userId,
                  userId: post.authorId,
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error in toggleLike: ", error);
    return { success: false, error: "Failed to like post" };
  }
}

export async function createComment(postId: string, content: string) {
  const userId = await getDbUserId();

  if (!userId) return { success: false, error: "User not found" };
  if (!content) return { success: false, error: "Comment cannot be empty" };

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  try {
    const [comment] = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content: content,
          postId: postId,
          authorId: userId,
        },
      });

      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: NotificationType.COMMENT,
            creatorId: userId,
            userId: post.authorId,
            postId,
            commentId: newComment.id,
          },
        });
      }

      return [newComment];
    });

    revalidatePath(`/`);
    return { success: true, comment };
  } catch (error) {
    console.log("Error in createComment: ", error);
    return { success: false, error: "Failed to create comment" };
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return { success: false, error: "User not found" };

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) return { success: false, error: "Post not found" };

    if (post.authorId !== userId) {
      return { success: false, error: "You are not the author of this post" };
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error in deletePost: ", error);
    return { success: false, error: "Failed to delete post" };
  }
}
