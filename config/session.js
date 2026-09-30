import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pool from '../db/pool.js';


const PgSession = connectPgSimple(session);  

const sessionStore = new PgSession({ 
  pool,
  createTableIfMissing: true,
});

export const sessionConfig = {
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    secure: process.env.NODE_ENV === 'production',
}

