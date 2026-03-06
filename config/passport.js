const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../data/db');

module.exports = function(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
      const user = db.users.find(u => u.email === email.toLowerCase());
      if (!user) return done(null, false, { message: 'No account found with that email' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    const user = db.users.find(u => u.id === id);
    done(null, user || null);
  });
};
