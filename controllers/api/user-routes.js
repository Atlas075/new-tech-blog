const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.userId = newUser.id;
      req.session.username = newUser.username;
      req.session.loggedIn = true;

      res.json(newUser);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', withAuth, async (req, res) => {
  User.findOne({
       where: {
        username: req.body.username,
      },
  }).then(user => {
   if (!user) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

const validPassword = user.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }
    req.session.save(() => {
         req.session.user_id = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;

      res.json({ user, message: 'You are now logged in!' });
    })
  })
});

router.post('/signup', withAuth, async (rep, res) => {
  console.log("username", req.body.username)

  User.findOne({
    where: {
     username: req.body.username,
   },
}).then(user => {
  console.log('hellllpppp',user)
if (user) {
   res.status(400).json({ message: 'Username already taken!' });
   return;
 }

const validPassword = user.checkPassword(req.body.password);

 if (validPassword) {
   res.status(400).json({ message: 'Not a valid password!' });
   return;
 }
 req.session.save(() => {
      req.session.user_id = user.id;
   req.session.username = user.username;
   req.session.loggedIn = true;

   res.json({ user, message: 'You are now logged in!' });
 })
})
})

router.post('/logout', withAuth, (req, res) => {
  console.log('heloooooooooooooooooooooooooooo',req.session.loggedIn)
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
