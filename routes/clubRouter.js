import { Router } from "express";
import { getBecomeAdmin, getJoinClub, postBecomeAdmin, postJoinClub } from "../controllers/clubController.js";
import { isAuth } from "../middleware/auth.js";


export const clubRouter = Router()

clubRouter.get('/join-club',isAuth, getJoinClub)
clubRouter.post('/join-club',isAuth, postJoinClub)
clubRouter.get('/become-admin',isAuth, getBecomeAdmin)
clubRouter.post('/become-admin',isAuth, postBecomeAdmin)