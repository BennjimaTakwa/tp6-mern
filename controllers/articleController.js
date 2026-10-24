const Article = require('../models/articleModel');

// 1. Retrieve all articles populated with author information
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate('author', 'name email');
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Create a new article (POST /api/articles - protected)
const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ message: 'Titre et contenu obligatoires' });
    }
    // The author comes from the verified token: impersonation is impossible
    const newArticle = await Article.create({
      title,
      content,
      author: req.user._id
    });
    const populated = await newArticle.populate('author', 'name email role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2b. Retrieve the logged-in user's own articles (GET /api/articles/my-articles - protected)
const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id })
      .populate('author', 'name email');
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Retrieve a single article by ID
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name email');

    if (!article) {
      return res.status(404).json({
        message: 'Article not found'
      });
    }

    res.status(200).json(article);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid resource identifier (ObjectId expected)'
      });
    }

    res.status(500).json({ message: err.message });
  }
};


// 4. Update an existing article (PUT /api/articles/:id - protected: author or admin)
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouve' });
    }
    // Ownership check
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: "Action interdite : vous n'etes pas l'auteur de cet article"
      });
    }
    article.title = (req.body && req.body.title) || article.title;
    article.content = (req.body && req.body.content) || article.content;
    const updated = await article.save();
    const populated = await updated.populate('author', 'name email role');
    res.status(200).json(populated);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Identifiant invalide' });
    }
    res.status(500).json({ message: err.message });
  }
};

// 5. Delete an article (DELETE /api/articles/:id - protected: author or admin)
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouve' });
    }
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: "Action interdite : vous n'etes pas l'auteur de cet article"
      });
    }
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Article supprime avec succes', id: req.params.id });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Identifiant invalide' });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllArticles,
  createArticle,
  getMyArticles,
  getArticleById,
  updateArticle,
  deleteArticle
};
