import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    axios.post('/auth/register', { username, password })
      .then(() => navigate('/login'))
      .catch(() => setError('Username already taken'))
  }

  return (
    <div className="container mt-4">
      <h2>Register</h2>
      {error && <div className="alert alert-warning">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  )
}

export default Register
