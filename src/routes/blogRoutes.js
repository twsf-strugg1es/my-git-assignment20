const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

// All blog routes are protected — JWT required
router.use(protect);

router
  .route('/')
  .get(getAllBlogs)
  .post(upload.single('blogImage'), createBlog);

router
  .route('/:id')
  .get(getBlogById)
  .patch(upload.single('blogImage'), updateBlog)
  .delete(deleteBlog);

module.exports = router;