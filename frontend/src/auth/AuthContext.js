import { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('username') || null)

  const login = (username, token) => {
    localStorage.setItem('username', username)
    localStorage.setItem('token', token)
    setUser(username)
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
