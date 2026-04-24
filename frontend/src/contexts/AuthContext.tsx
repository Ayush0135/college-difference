'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
    id: string
    email: string
    phone?: string
    role?: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    login: (user: User, token: string) => void
    logout: () => void
    isAuthModalOpen: boolean
    openAuthModal: () => void
    closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isLoading: true,
    login: () => {},
    logout: () => {},
    isAuthModalOpen: false,
    openAuthModal: () => {},
    closeAuthModal: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    useEffect(() => {
        // Load from local storage
        const storedUser = localStorage.getItem('auth_user')
        const storedToken = localStorage.getItem('auth_token')
        const storedExpiry = localStorage.getItem('auth_expiry')
        
        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser)
                // Check for session expiry if role is admin
                if (parsedUser.role === 'admin' && storedExpiry) {
                    if (Date.now() > parseInt(storedExpiry)) {
                        console.log("Admin session expired")
                        logout()
                        setIsLoading(false)
                        return
                    }
                }
                setUser(parsedUser)
                setToken(storedToken)
            } catch (e) {
                console.error("Failed to parse stored user", e)
                logout()
            }
        }
        setIsLoading(false)
    }, [])

    const login = (userData: User, jwtToken: string) => {
        setUser(userData)
        setToken(jwtToken)
        localStorage.setItem('auth_user', JSON.stringify(userData))
        localStorage.setItem('auth_token', jwtToken)
        
        // Set 30 min expiry for admin
        if (userData.role === 'admin') {
            const expiry = Date.now() + 30 * 60 * 1000
            localStorage.setItem('auth_expiry', expiry.toString())
        } else {
            localStorage.removeItem('auth_expiry')
        }
        
        setIsAuthModalOpen(false)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_expiry')
    }

    // Periodic check for session expiry
    useEffect(() => {
        if (user?.role === 'admin') {
            const interval = setInterval(() => {
                const storedExpiry = localStorage.getItem('auth_expiry')
                if (storedExpiry && Date.now() > parseInt(storedExpiry)) {
                    logout()
                }
            }, 10000) // Check every 10s
            return () => clearInterval(interval)
        }
    }, [user])

    return (
        <AuthContext.Provider value={{
            user, token, isLoading, login, logout,
            isAuthModalOpen, openAuthModal: () => setIsAuthModalOpen(true), closeAuthModal: () => setIsAuthModalOpen(false)
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
