'use client'

import type { User } from '@/payload-types'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

/** Context types */
type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<void>

type ForgotPassword = (args: { email: string }) => Promise<void>

type Create = (args: { email: string; password: string; passwordConfirm: string }) => Promise<void>

type Login = (args: { email: string; password: string }) => Promise<User>

type Logout = () => Promise<void>

type AuthContext = {
  create: Create
  forgotPassword: ForgotPassword
  login: Login
  logout: Logout
  resetPassword: ResetPassword
  setUser: (user: User | null) => void
  status: 'loggedIn' | 'loggedOut' | undefined
  user?: User | null
}

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>()
  const [status, setStatus] = useState<'loggedIn' | 'loggedOut' | undefined>()

  const create: Create = useCallback(async ({ email, password, passwordConfirm }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/create`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, passwordConfirm }),
    })

    const { data, errors } = await res.json()
    if (!res.ok || errors) throw new Error(errors?.[0]?.message || 'Invalid login')

    setUser(data?.loginUser?.user)
    setStatus('loggedIn')
  }, [])

  const login: Login = useCallback(async ({ email, password }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const { errors, user: loggedUser } = await res.json()
    if (!res.ok || errors) throw new Error(errors?.[0]?.message || 'Invalid login')

    setUser(loggedUser)
    setStatus('loggedIn')
    return loggedUser
  }, [])

  const logout: Logout = useCallback(async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) throw new Error('An error occurred while attempting to logout.')

    setUser(null)
    setStatus('loggedOut')
  }, [])

  const forgotPassword: ForgotPassword = useCallback(async ({ email }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const { data, errors } = await res.json()
    if (!res.ok || errors) throw new Error(errors?.[0]?.message || 'Invalid request')

    setUser(data?.loginUser?.user)
  }, [])

  const resetPassword: ResetPassword = useCallback(async ({ password, passwordConfirm, token }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, passwordConfirm, token }),
    })

    const { data, errors } = await res.json()
    if (!res.ok || errors) throw new Error(errors?.[0]?.message || 'Invalid reset')

    setUser(data?.loginUser?.user)
    setStatus(data?.loginUser?.user ? 'loggedIn' : undefined)
  }, [])

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })

        const { user: meUser } = await res.json()
        setUser(meUser || null)
        setStatus(meUser ? 'loggedIn' : undefined)
      } catch {
        setUser(null)
      }
    }

    void fetchMe()
  }, [])

  return (
    <Context.Provider
      value={{
        create,
        forgotPassword,
        login,
        logout,
        resetPassword,
        setUser,
        status,
        user,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useAuth = (): AuthContext => useContext(Context)
