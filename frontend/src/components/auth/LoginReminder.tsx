'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'

export default function LoginReminder() {
    const { user, isAuthModalOpen, openAuthModal, isLoading } = useAuth()
    const lastPromptRef = useRef<number>(Date.now())
    const pathname = usePathname()

    useEffect(() => {
        // Don't bother if loading, already logged in, or on the admin route
        if (isLoading || user || pathname?.startsWith('/admin')) return

        const interval = setInterval(() => {
            // Only open if it's not already open and user is still not logged in
            if (!isAuthModalOpen && !user) {
                console.log("Login Reminder: Triggering auth modal after 15 seconds...")
                openAuthModal()
            }
        }, 15000) // 15 seconds

        return () => clearInterval(interval)
    }, [user, isAuthModalOpen, openAuthModal, isLoading, pathname])

    return null // This component doesn't render anything itself
}
