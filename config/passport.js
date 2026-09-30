import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getUserByUsername, getUserById } from '../db/queries.js';
import { verifyPassword } from '../utils/password.js';

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await getUserByUsername(username)
    if (!user) {
       return done(null, false, {message: 'Incorrect email or password'})
    }
    if (await verifyPassword(password, user.password)) {
        return done(null, user)
    }
    else{
        return done(null, false, {message: 'Incorrect email or password'})
    }

  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => {
        done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id)
    done(null, user)
  } catch (error) {
    done(error)
  }

});
