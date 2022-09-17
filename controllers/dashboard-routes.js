const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models/");
const withAuth = require("../utils/auth");

router.get("/", withAuth, async (req, res) => {
  Post.findAll({
    Where: {
      user_id: req.session.user_id,
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
  })
    .then((postData) => {
      const posts = postData.map((post) => post.get({ plain: true }));
      res.render("dashboard", { posts, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("login");
    });
});

router.get("/new", withAuth, (req, res) => {
  // what view should we send the client when they want to create a new-post? (change this next line)
  res.render("new-post", {
    // again, rendering with a different layout than main! no change needed
    layout: "dashboard",
  });
});

router.get("/edit/:id", withAuth, async (req, res) => {
  Post.findByPk(req.params.id, {
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
  })
    .then((postData) => {
      if (postData) {
        // serializing the data
        const post = postData.get({ plain: true });
        // which view should we render if we want to edit a post?
        res.render("edit-post", {
          layout: "dashboard",
          post,
          loggedIn: true
        });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.redirect("login");
    });
});

module.exports = router;
