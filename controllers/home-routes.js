const router = require('express').Router();
const { Post, Comment, User } = require('../models/');
const sequelize = require("../config/connection");

// get all posts for homepage
router.get('/', async (req, res) => {
  Post.findAll({
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",

    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  }).then ((postData) => {
    const posts = postData.map((post) => post.get({ plain: true })); 
     res.render('homepage', { posts,
    loggedIn: req.session.loggedIn });
  }).catch((err) => {
    console.log(err)
    res.status(500).json(err);
  }) 
  })


// get single post
router.get('/post/:id', async (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  }).then ((postData) => {
    if (!postData) {
      res.status(404).json({ message: "No post found with this id" });
        return;
    }
    const post = postData.get({ plain: true });
    res.render("single-post", { post,
      loggedIn: req.session.loggedIn });
  })   .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

// giving you the login and signup route pieces below, no changes needed.
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

module.exports = router;
