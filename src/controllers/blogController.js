const Blog = require('../models/blogModel');
const fs = require('fs');
const path = require('path');

// Helper: build full image URL
const buildImageUrl = (req, filename) => {
  if (!filename) return '';
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, authorName, tags } = req.body;

    if (!title || !content || !authorName) {
      return res.status(400).json({
        success: false,
        message: 'title, content and authorName are required',
      });
    }

    // tags can come as a comma-separated string or array
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const blogImage = req.file ? buildImageUrl(req, req.file.filename) : '';

    const blog = await Blog.create({
      title,
      content,
      authorName,
      tags: parsedTags,
      blogImage,
      author: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Private
exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: { blogs },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single blog by ID
// @route   GET /api/blogs/:id
// @access  Private
exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      'author',
      'name email'
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog (only creator)
// @route   PATCH /api/blogs/:id
// @access  Private
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Ownership check
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this blog',
      });
    }

    const updatable = ['title', 'content', 'authorName', 'tags'];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'tags' && typeof req.body[field] === 'string') {
          blog.tags = req.body[field]
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        } else {
          blog[field] = req.body[field];
        }
      }
    });

    // Handle new image upload
    if (req.file) {
      // Optional: delete old image
      if (blog.blogImage) {
        const oldFilename = blog.blogImage.split('/uploads/')[1];
        if (oldFilename) {
          const oldPath = path.join(__dirname, '../../uploads', oldFilename);
          if (fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch (_) {}
          }
        }
      }
      blog.blogImage = buildImageUrl(req, req.file.filename);
    }

    const updatedBlog = await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: { blog: updatedBlog },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog (only creator)
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this blog',
      });
    }

    // Delete associated image file
    if (blog.blogImage) {
      const filename = blog.blogImage.split('/uploads/')[1];
      if (filename) {
        const imgPath = path.join(__dirname, '../../uploads', filename);
        if (fs.existsSync(imgPath)) {
          try { fs.unlinkSync(imgPath); } catch (_) {}
        }
      }
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};