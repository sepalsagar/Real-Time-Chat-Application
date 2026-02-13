import { Request, Response } from "express";
import prisma from "../config/prisma.config";
import apiResponse from "../utils/apiResponse";

export const getConversation = async (req: Request, res: Response) => {
  try {
    const { userId, otherUserId } = req.params;
    if (!userId || !otherUserId) {
      return apiResponse(res, 400, false, "userId and otherUserId are required");
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    };

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { timeStamp: "desc" },
        skip,
        take: limit,
      }),
      prisma.message.count({ where }),
    ]);

    return apiResponse(res, 200, true, "Conversation fetched", {
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch conversation", error);
    return apiResponse(res, 500, false, "Failed to fetch conversation");
  }
};
