"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.actions";

export async function getNotifications(userId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            comment: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (err) {
    console.error("Error fetching notifications: ", err);
    throw new Error("Failed to fetch notifications");
  }
}

export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Error marking notifications as read: ", err);
    return { success: false, error: "Error marking notifications as read" };
  }
}
