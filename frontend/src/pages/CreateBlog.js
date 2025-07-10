import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import CategorySelect from '../components/CategorySelect'

const CreateBlog = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 5) {
      setMessage('Maximum 5 images allowed')
      return
    }
    setImages(prev => [...prev, ...files])
    setImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  useEffect(() => {
    return () => imagePreviews.forEach(url => URL.revokeObjectURL(url))
  }, [imagePreviews])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (images.length > 5) {
      setMessage('Maximum 5 images allowed')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('category', category)
    formData.append('fullContent', content)
    images.forEach(img => formData.append('images', img))

    try {
      await axios.post('/blogs', formData)
      navigate('/myblogs')
    } catch {
      setMessage('Failed to create blog')
    }
  }

  return (
    <div className="container mt-4">
      <h2>Create Blog</h2>
      {message && <div className="alert alert-warning">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <CategorySelect value={category} onChange={e => setCategory(e.target.value)} />
        <textarea className="form-control mb-2" placeholder="Content" value={content} onChange={e => setContent(e.target.value)} rows="6" required />
        <input className="form-control mb-2" type="file" multiple accept="image/*" onChange={handleImageChange} />
        <div className="mb-3">
          {imagePreviews.map((src, idx) => (
            <div key={idx} className="d-inline-block position-relative me-2 mb-2">
              <img src={src} alt="preview" style={{ height: 100, borderRadius: 4 }} />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                style={{
                  position: 'absolute', top: 0, right: 0, background: 'red',
                  border: 'none', borderRadius: '50%', color: 'white',
                  width: 20, height: 20, cursor: 'pointer'
                }}
              >×</button>
            </div>
          ))}
        </div>
        <button className="btn btn-primary">Post</button>
      </form>
    </div>
  )
}

export default CreateBlog
