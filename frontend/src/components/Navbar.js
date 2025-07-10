import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">BlogApp</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && <li className="nav-item"><Link className="nav-link" to="/create">Create</Link></li>}
            {user && <li className="nav-item"><Link className="nav-link" to="/myblogs">My Blogs</Link></li>}
          </ul>
          <ul className="navbar-nav ms-auto">
            {!user && <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>}
            {!user && <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>}
            {user && <li className="nav-item"><button className="btn btn-sm btn-outline-light" onClick={logout}>Logout</button></li>}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
