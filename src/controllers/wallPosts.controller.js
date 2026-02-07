const WallPostController = {
  /* ----------------------------------------
     GET ALL WALL POSTS
  -----------------------------------------*/
  getWallPosts: async (req, res) => {
    try {
      const posts = await req.wallPostModel.findAll({
        order: [["createdAt", "DESC"]],
      });

      res.status(200).send({
        status: true,
        message: "Successfully fetched wall posts",
        data: posts,
        meta: { total: posts.length },
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: "Failed to fetch wall posts",
      });
    }
  },

  /* ----------------------------------------
     GET BY ID
  -----------------------------------------*/
  getWallPostById: async (req, res) => {
    try {
      const post = await req.wallPostModel.findByPk(
        req.params.id
      );

      if (!post) {
        return res.status(404).send({
          status: false,
          message: "Wall post not found",
        });
      }

      res.status(200).send({
        status: true,
        data: post,
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: "Failed to fetch post",
      });
    }
  },

  /* ----------------------------------------
     CREATE WALL POST
  -----------------------------------------*/
  createWallPost: async (req, res) => {
    try {
      const { title, content, image } = req.body;

      if (!title || !content) {
        return res.status(400).send({
          status: false,
          message: "Title & Content required",
        });
      }

      const post = await req.wallPostModel.create({
        title,
        content,
        image,
      });

      res.status(201).send({
        status: true,
        message: "Wall post created",
        data: post,
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: "Failed to create wall post",
      });
    }
  },

  /* ----------------------------------------
     UPDATE WALL POST
  -----------------------------------------*/
  updateWallPost: async (req, res) => {
    try {
      const post = await req.wallPostModel.findByPk(
        req.params.id
      );

      if (!post) {
        return res.status(404).send({
          status: false,
          message: "Post not found",
        });
      }

      const { title, content, image, status } =
        req.body;

      await post.update({
        title: title ?? post.title,
        content: content ?? post.content,
        image: image ?? post.image,
        status: status ?? post.status,
      });

      res.status(200).send({
        status: true,
        message: "Updated successfully",
        data: post,
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: "Failed to update",
      });
    }
  },

  /* ----------------------------------------
     DELETE WALL POST
  -----------------------------------------*/
  deleteWallPost: async (req, res) => {
    try {
      const post = await req.wallPostModel.findByPk(
        req.params.id
      );

      if (!post) {
        return res.status(404).send({
          status: false,
          message: "Post not found",
        });
      }

      const deleted = { ...post.dataValues };
      await post.destroy();

      res.status(200).send({
        status: true,
        message: "Deleted successfully",
        data: deleted,
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: "Failed to delete",
      });
    }
  },

  /* ----------------------------------------
     PUBLISH WALL POST (ONLY ONE)
  -----------------------------------------*/
 publishWallPost: async (req, res) => {
  try {
    const post = await req.wallPostModel.findByPk(
      req.params.id
    );

    if (!post) {
      return res.status(404).send({
        status: false,
        message: "Post not found",
      });
    }

    post.published = true;
    await post.save();

    res.status(200).send({
      status: true,
      message: "Wall post published",
      data: post,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to publish post",
    });
  }
},

/* ----------------------------------------
   UNPUBLISH WALL POST
-----------------------------------------*/
unpublishWallPost: async (req, res) => {
  try {
    const post = await req.wallPostModel.findByPk(
      req.params.id
    );

    if (!post) {
      return res.status(404).send({
        status: false,
        message: "Post not found",
      });
    }

    // Already unpublished check
    if (!post.published) {
      return res.status(400).send({
        status: false,
        message: "Post is already unpublished",
      });
    }

    post.published = false;
    await post.save();

    res.status(200).send({
      status: true,
      message: "Wall post unpublished successfully",
      data: post,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to unpublish post",
    });
  }
},



  /* ----------------------------------------
     GET PUBLISHED WALL POST
  -----------------------------------------*/
 getPublishedWallPost: async (req, res) => {
  try {
    const posts = await req.wallPostModel.findAll({
      where: { published: true },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send({
      status: true,
      data: posts,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to fetch published posts",
    });
  }
},

};

module.exports = WallPostController;
