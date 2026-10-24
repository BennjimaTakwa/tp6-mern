const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect } = require('../middlewares/authMiddleware');


router.get('/', articleController.getAllArticles);
// Must stay before '/:id', otherwise "my-articles" would be read as an id
router.get('/my-articles', protect, articleController.getMyArticles);
router.get('/:id', articleController.getArticleById);
router.post('/', protect, articleController.createArticle);
router.put('/:id', protect, articleController.updateArticle);
router.delete('/:id', protect, articleController.deleteArticle);
module.exports = router;
