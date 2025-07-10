import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MyBlogs from './pages/MyBlogs'
import CreateBlog from './pages/CreateBlog'
import EditBlog from './pages/EditBlog'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myblogs" element={<ProtectedRoute><MyBlogs /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
          <Route path="*" element={<h3 className="text-center mt-5">Page Not Found</h3>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
