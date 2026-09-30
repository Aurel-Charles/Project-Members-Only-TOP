import { HttpError } from "./httpErrorHandler.js";

export function isAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/log-in');
  }

export function isGuest(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect('/');
  }

export function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.is_admin) return next();
    next(new HttpError('Not authorized.', 403));
  }