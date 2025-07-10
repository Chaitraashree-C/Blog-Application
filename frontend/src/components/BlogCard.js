import { useContext, useState } from 'react'
import { AuthContext } from '../auth/AuthContext'
import axios from '../api/axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const BlogCard = ({ blog, showReactions }) => {
  const { user } = useContext(AuthContext)
  const [likes, setLikes] = useState(blog.likes)
  const [dislikes, setDislikes] = useState(blog.dislikes)
  const [userReaction, setUserReaction] = useState(blog.userReaction)
  const [expanded, setExpanded] = useState(false)

  const toggleReaction = (liked) => {
    if (!user) return
    if (userReaction === liked) {
      axios.delete(`/blogs/${blog.id}/react`).then(() => {
        setUserReaction(null)
        liked ? setLikes(likes - 1) : setDislikes(dislikes - 1)
      })
    } else {
      axios.post(`/blogs/${blog.id}/react?liked=${liked}`).then(() => {
        if (userReaction === true) setLikes(likes - 1)
        if (userReaction === false) setDislikes(dislikes - 1)
        liked ? setLikes(likes + 1) : setDislikes(dislikes + 1)
        setUserReaction(liked)
      })
    }
  }

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  const contentToShow = expanded ? blog.fullContent : blog.fullContent.slice(0, 300)

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5>{blog.title}</h5>
        <p className="text-muted">
          {blog.category} <br />
          {blog.author} <br />
          {formatDate(blog.createdAt)}
        </p>

        {blog.imageUrls.length > 0 && (
          <div className="mb-3">
            <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={10} slidesPerView={1} style={{ paddingBottom: '30px' }}>
              {blog.imageUrls.map((url, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={`http://localhost:8080${url}`}
                    alt=""
                    className="img-fluid rounded"
                    style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <p style={{ whiteSpace: 'pre-line' }}>{contentToShow}{!expanded && blog.fullContent.length > 300 && '...'}</p>
        {blog.fullContent.length > 300 && (
          <button className="btn btn-link p-0" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        <div className="mt-2">
          {user && showReactions !== false ? (
            <>
              <button className={`btn btn-sm me-2 ${userReaction === true ? 'btn-success' : 'btn-outline-success'}`} onClick={() => toggleReaction(true)}>👍 {likes}</button>
              <button className={`btn btn-sm ${userReaction === false ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => toggleReaction(false)}>👎 {dislikes}</button>
            </>
          ) : (
            <>
              <button className="btn btn-sm btn-outline-secondary me-2" disabled>👍 {likes}</button>
              <button className="btn btn-sm btn-outline-secondary" disabled>👎 {dislikes}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogCard
