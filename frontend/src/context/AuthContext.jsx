import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../services/authService'

const AuthContext = createContext(null)

const TOKEN_KEY =
  'riderjob_access_token'

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    async function loadUser() {
      const token =
        localStorage.getItem(
          TOKEN_KEY,
        )

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const currentUser =
          await getCurrentUser()

        setUser(currentUser)
      } catch {
        localStorage.removeItem(
          TOKEN_KEY,
        )
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  async function login(
    email,
    password,
  ) {
    const data = await loginUser(
      email,
      password,
    )

    localStorage.setItem(
      TOKEN_KEY,
      data.access_token,
    )

    setUser(data.user)

    return data.user
  }

  async function register(
    email,
    password,
    displayName,
  ) {
    const data = await registerUser(
      email,
      password,
      displayName,
    )

    localStorage.setItem(
      TOKEN_KEY,
      data.access_token,
    )

    setUser(data.user)

    return data.user
  }

  function logout() {
    localStorage.removeItem(
      TOKEN_KEY,
    )

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated:
          Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider.',
    )
  }

  return context
}