import { Router } from "express";
import { getConversation } from "../controller/message.controller";

const messageRouter = Router();

messageRouter.get("/:userId/:otherUserId", getConversation);

export default messageRouter;
