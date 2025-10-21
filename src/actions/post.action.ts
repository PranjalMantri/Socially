"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.actions";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("Unauthorized user");

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (err) {
    console.error("Failed to create post: ", err);
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
            image: true,
            name: true,
            username: true,
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
            createdAt: "desc",
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
  } catch (err) {
    console.error("Error fetching posts: ", err);
    throw new Error("Error fetching posts");
  }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return null;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      // like
      await prisma.$transaction([
        prisma.like.create({
          data: {
            postId,
            userId,
          },
        }),

        ...(post.authorId === userId
          ? []
          : [
              prisma.notification.create({
                data: {
                  notificationType: "LIKE",
                  postId,
                  creatorId: userId,
                  userId: post.authorId,
                },
              }),
            ]),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Error liking the post: ", err);
    return { success: false, error: "Error liking the post" };
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return null;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    const result = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          authorId: userId,
          postId,
          comment: content,
        },
      });

      await tx.notification.create({
        data: {
          notificationType: "COMMENT",
          userId: post.authorId,
          creatorId: userId,
          postId,
          commentId: newComment.id,
        },
      });

      return newComment;
    });

    console.log(result);

    revalidatePath("/");
    return { success: true, result };
  } catch (err) {
    console.error("Error creating comment: ", err);
    return { success: false, error: "Error creating comment" };
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw new Error("Post does not exist");

    if (post.authorId !== userId)
      throw new Error("You are not authorized to delete this post");

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Error deleting post: ", err);
    return { success: false, error: "Error deleting post" };
  }
}
