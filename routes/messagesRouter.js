import { Router } from "express";
import { getMessage, getMessageNew, postDeleteMessage, postMessageNew, validateMessage } from "../controllers/messagesController.js";
import { isAdmin, isAuth } from "../middleware/auth.js";

export const messageRouter = Router()


messageRouter.get('/', getMessage)
messageRouter.get('/messages/new',isAuth, getMessageNew)
messageRouter.post('/messages/new',isAuth,validateMessage , postMessageNew)
messageRouter.post('/messages/:id/delete',isAdmin, postDeleteMessage)