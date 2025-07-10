import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../api/axios'
import CategorySelect from '../components/CategorySelect'

const EditBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [newImagePreviews, setNewImagePreviews] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get(`/blogs/${id}`).then(res => {
      const b = res.data
      setTitle(b.title)
      setCategory(b.category)
      setContent(b.fullContent)
      setExistingImages(b.imageUrls.map((url, idx) => ({ id: idx, url })))
    })
  }, [id])

  const handleDeleteExistingImage = (imgId) => {
    setExistingImages(existingImages.filter(img => img.id !== imgId))
  }

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files)
    if (existingImages.length + newImages.length + files.length > 5) {
      setMessage('Maximum 5 images allowed')
      return
    }
    setNewImages(prev => [...prev, ...files])
    setNewImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))])
  }

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  useEffect(() => {
    return () => newImagePreviews.forEach(url => URL.revokeObjectURL(url))
  }, [newImagePreviews])

  const handleUpdate = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('category', category)
    formData.append('fullContent', content)
    existingImages.forEach(img => formData.append('existingImages', img.url))
    newImages.forEach(img => formData.append('images', img))

    try {
      await axios.put(`/blogs/${id}`, formData)
      navigate('/myblogs')
    } catch {
      setMessage('Failed to update blog')
    }
  }

  return (
    <div className="container mt-4">
      <h2>Edit Blog</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <form onSubmit={handleUpdate}>
        <input className="form-control mb-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <CategorySelect value={category} onChange={e => setCategory(e.target.value)} />
        <textarea className="form-control mb-2" placeholder="Content" value={content} onChange={e => setContent(e.target.value)} rows="6" required />

        <div className="mb-2">Existing Images:</div>
        <div className="mb-3">
          {existingImages.map(img => (
            <div key={img.id} className="d-inline-block position-relative me-2 mb-2">
              <img src={`http://localhost:8080${img.url}`} alt="existing" style={{ height: 100, borderRadius: 4 }} />
              <button type="button" onClick={() => handleDeleteExistingImage(img.id)} style={{
                position: 'absolute', top: 0, right: 0, background: 'red', border: 'none',
                borderRadius: '50%', color: 'white', width: 20, height: 20, cursor: 'pointer'
              }}>×</button>
            </div>
          ))}
        </div>

        <input className="form-control mb-3" type="file" multiple accept="image/*" onChange={handleNewImagesChange} />

        <div className="mb-3">
          {newImagePreviews.map((src, idx) => (
            <div key={idx} className="d-inline-block position-relative me-2 mb-2">
              <img src={src} alt="new" style={{ height: 100, borderRadius: 4 }} />
              <button type="button" onClick={() => removeNewImage(idx)} style={{
                position: 'absolute', top: 0, right: 0, background: 'red', border: 'none',
                borderRadius: '50%', color: 'white', width: 20, height: 20, cursor: 'pointer'
              }}>×</button>
            </div>
          ))}
        </div>

        <button className="btn btn-warning">Update</button>
      </form>
    </div>
  )
}

export default EditBlog
