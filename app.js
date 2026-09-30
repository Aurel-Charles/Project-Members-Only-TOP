import 'dotenv/config';
import express from 'express'
import { logger } from './middleware/logger.js';
import { messageRouter,  } from './routes/messagesRouter.js';
import { authRouter } from './routes/authRouter.js';
import { clubRouter } from './routes/clubRouter.js';
import session from 'express-session';
import { sessionConfig } from './config/session.js';
import passport from 'passport';
import './config/passport.js'
import { HttpError } from './middleware/httpErrorHandler.js';

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.use(session(sessionConfig))
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(logger)
app.use('/', messageRouter )
app.use('/', authRouter )
app.use('/', clubRouter )

app.use((req, res, next) => {
  next(new HttpError("This page doesn't exist.", 404));
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';
  res.status(status).render('error', {
    status,
    message: isProd && status === 500 ? 'Something went wrong.' : err.message,
  });
});

app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`MembersOnly Express app - Visit  http://localhost:${PORT}/ !`);
  });