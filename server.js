const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog-posts', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

// Define a Blog Post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    date: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// CRUD Routes

// Create a new post
app.post('/api/posts', async (req, res) => {
    const { title, content, author } = req.body;
    const newPost = new Post({ title, content, author });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single post by ID
app.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a post
app.put('/api/posts/:id', async (req, res) => {
    const { title, content, author } = req.body;
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content, author }, { new: true });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a post
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: "Post not found" });
        res.status(200).json({ message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
