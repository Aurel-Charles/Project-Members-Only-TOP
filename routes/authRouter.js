import { Router } from "express";
import { getLogIn, getSignUp, postLogIn, postLogOut, postSignUp, validateSignUp } from "../controllers/authController.js";
import { isAuth, isGuest } from "../middleware/auth.js";
import { normalizeUsername } from "../middleware/normalizeEmail.js";


export const authRouter = Router()

authRouter.get('/sign-up',isGuest, getSignUp)
authRouter.post('/sign-up',isGuest, validateSignUp, postSignUp)
authRouter.get('/log-in',isGuest, getLogIn)
authRouter.post('/log-in',isGuest,normalizeUsername, postLogIn)
authRouter.post('/log-out',isAuth, postLogOut)