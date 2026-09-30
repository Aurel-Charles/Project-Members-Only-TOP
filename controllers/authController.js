import { body, validationResult } from "express-validator"
import { createUser, usernameExists } from "../db/queries.js"
import { createPassword } from "../utils/password.js";
import passport from "passport";



// Registration
export function getSignUp(req, res, next) {
    res.render('sign-up')
}

export const validateSignUp = [
    body('firstname')
      .trim()
      .notEmpty().withMessage('First name is required').bail()
      .isLength({ max: 20 }).withMessage('First name must be 20 characters max'),
  
    body('lastname')
        .trim()
        .notEmpty().withMessage('Last name is required').bail()
        .isLength({ max: 20 }).withMessage('Last name must be 20 characters max'),
  
    body('username')
      .trim()
      .notEmpty().withMessage('Email is required').bail()
      .isEmail().withMessage('Must be a valid email').bail()
      .normalizeEmail({ gmail_remove_dots: false })
      .isLength({ max: 255 }).withMessage('Email is too long').bail()
      .custom(async (value) => {
        const isTaken = await usernameExists(value);
        if (isTaken) throw new Error('Email already taken');
      }),
  
    body('password')
      .isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
  
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords don't match"),
  ];

export async function postSignUp(req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).render('sign-up', {errors: errors.array(), values: req.body})
        }
        const {firstname, lastname, username, password} = req.body
        const passwordHash = await createPassword(password)
        await createUser({firstname, lastname, username, passwordHash})
        res.redirect('/log-in')
        
    } catch (error) {
        next(error)
    }
}


// log in

export async function getLogIn(req, res, next) {
    const messages = req.session.messages ?? [];
    req.session.messages = [];
    res.render('log-in', { messages });
}

export const postLogIn = passport.authenticate('local', {successRedirect: "/", failureRedirect: "/log-in", failureMessage: true})



// Log-out
export function postLogOut(req, res, next) {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy((err) =>{
            if (err) {
                return next(err)
            }
            res.clearCookie('connect.sid')
            res.redirect('/');
        })
      });
    }