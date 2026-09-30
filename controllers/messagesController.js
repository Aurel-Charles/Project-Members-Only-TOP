import { body, param, validationResult } from "express-validator"
import { createMessage, deleteMessage, getAllMessages, getAllMessagesWithAuthor } from "../db/queries.js"


export async function getMessage(req, res, next) {
    try {
        if (req.user && req.user.is_member) {
            const messages = await getAllMessagesWithAuthor()
            return res.render('index', {messages})
        }
        const messages = await getAllMessages()
        
        res.render('index', {messages})
    } catch (error) {
        next(error)
    }
}

export function getMessageNew(req, res) {
    res.render('new-message')
}

export const validateMessage = [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required').bail()
      .isLength({ max: 40 }).withMessage('Title must be 40 characters max'),
  
    body('text')
      .trim()
      .notEmpty().withMessage('Message is required').bail()
      .isLength({ max: 200 }).withMessage('Message must be 200 characters max'),
]

export async function postMessageNew(req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).render('new-message', {errors: errors.array(), values: req.body})
        }
        const {title, text} = req.body
        const user_id = req.user.id

        await createMessage({title, text, user_id})
        res.redirect('/')

    } catch (error) {
        next(error)
    }
}

export async function postDeleteMessage(req, res, next) {
    try {
        param('id').isInt().withMessage('Invalid message id')
        const id = req.params.id
        await deleteMessage(id)
        res.redirect('/')
    } catch (error) {
        next(error)
    }
}