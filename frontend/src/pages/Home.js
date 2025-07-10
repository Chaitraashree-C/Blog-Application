import { useEffect, useState } from 'react'
import axios from '../api/axios'
import BlogCard from '../components/BlogCard'
import { categories } from '../components/CategorySelect'

const Home = () => {
  const [blogs, setBlogs] = useState([])
  const [page, setPage] = useState(0)
  const [category, setCategory] = useState('')
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const endpoint = category
      ? `/blogs/filter?category=${category}&page=${page}&size=5`
      : `/blogs/public?page=${page}&size=5`
    axios.get(endpoint).then(res => {
      setBlogs(res.data.content)
      setTotalPages(res.data.totalPages)
    })
  }, [page, category])

  const renderPageNumbers = () =>
    [...Array(totalPages).keys()].map(num => (
      <button
        key={num}
        className={`btn btn-sm me-1 ${page === num ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => setPage(num)}
      >
        {num + 1}
      </button>
    ))

  return (
    <div className="container mt-4">
      <h2>Recent Blogs</h2>
      <div className="mb-3">
        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      {blogs.map(blog => <BlogCard key={blog.id} blog={blog} />)}
      <div className="d-flex justify-content-center mt-3">
        {renderPageNumbers()}
      </div>
    </div>
  )
}

export default Home
