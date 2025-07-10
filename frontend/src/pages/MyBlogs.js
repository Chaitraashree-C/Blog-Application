import { useEffect, useState } from 'react'
import axios from '../api/axios'
import BlogCard from '../components/BlogCard'
import { useNavigate } from 'react-router-dom'

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const fetchMyBlogs = () => {
    axios.get('/blogs/my')
      .then(res => setBlogs(res.data))
      .catch(() => setMessage('Failed to load your blogs'))
  }

  useEffect(() => {
    fetchMyBlogs()
  }, [])

  const handleDelete = (id) => {
    axios.delete(`/blogs/${id}`)
      .then(() => fetchMyBlogs())
      .catch(() => setMessage('Failed to delete blog'))
  }

  return (
    <div className="container mt-4">
      <h2>My Blogs</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      {blogs.map(blog => (
        <div key={blog.id}>
          <BlogCard blog={blog} showReactions={false} />
          <div className="mb-4">
            <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(blog.id)}>Delete</button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/edit/${blog.id}`)}>Edit</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyBlogs
