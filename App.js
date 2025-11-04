import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });

    useEffect(() => {
        axios.get('http://localhost:3000/api/posts')
            .then(response => setPosts(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/api/posts', newPost)
            .then(response => {
                setPosts([...posts, response.data]);
                setNewPost({ title: '', content: '', author: '' });
            })
            .catch(error => console.error(error));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/api/posts/${id}`)
            .then(() => {
                setPosts(posts.filter(post => post._id !== id));
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="App">
            <h1>Blog Post Management</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={handleChange}
                />
                <textarea
                    name="content"
                    placeholder="Content"
                    value={newPost.content}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={newPost.author}
                    onChange={handleChange}
                />
                <button type="submit">Create Post</button>
            </form>

            <ul>
                {posts.map(post => (
                    <li key={post._id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <small>By {post.author} on {new Date(post.date).toLocaleDateString()}</small>
                        <button onClick={() => handleDelete(post._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
