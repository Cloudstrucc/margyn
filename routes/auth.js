const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../data/db');
const { forwardAuthenticated } = require('../middleware/auth');

router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('auth/login', { layout: 'landing', title: 'Sign In — Margyn' });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('auth/register', { layout: 'landing', title: 'Create Account — Margyn' });
});

router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) errors.push({ msg: 'All fields are required' });
  if (password !== password2) errors.push({ msg: 'Passwords do not match' });
  if (password && password.length < 6) errors.push({ msg: 'Password must be at least 6 characters' });

  if (errors.length > 0) {
    return res.render('auth/register', { layout: 'landing', title: 'Create Account — Margyn', errors, name, email });
  }

  if (db.users.find(u => u.email === email.toLowerCase())) {
    errors.push({ msg: 'Email already registered' });
    return res.render('auth/register', { layout: 'landing', title: 'Create Account — Margyn', errors, name, email });
  }

  const hashed = await bcrypt.hash(password, 10);
  db.users.push({
    id: uuidv4(),
    name,
    email: email.toLowerCase(),
    password: hashed,
    role: 'analyst',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00D4FF&color=0A1628&bold=true`
  });

  req.flash('success_msg', 'Account created! You can now log in.');
  res.redirect('/auth/login');
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success_msg', 'You have been logged out');
    res.redirect('/auth/login');
  });
});

module.exports = router;
