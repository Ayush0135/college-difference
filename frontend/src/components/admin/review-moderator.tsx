'use client'
import { API_URL } from '@/lib/api'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ReviewModerator() {
    const { token } = useAuth()
    const [reviews, setReviews] = useState<any[]>([])
    
    useEffect(() => {
        if (!token) return;
        fetch(`${API_URL}/admin/reviews/pending`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { if (!data.error && !data.detail) setReviews(data) })
            .catch(console.error)
    }, [token])
    
    const approve = async (id: string) => {
        await fetch(`${API_URL}/admin/reviews/${id}/approve`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } })
        setReviews(reviews.filter(r => r.id !== id))
    }
    
    const reject = async (id: string) => {
        await fetch(`${API_URL}/admin/reviews/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
        setReviews(reviews.filter(r => r.id !== id))
    }
    
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border bg-muted/30">
                <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                    <MessageSquare size={20} /> Pending Reviews ({reviews.length})
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Review student submissions before they go live on college pages.</p>
            </div>
            
            <div className="divide-y divide-border">
                {reviews.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground font-medium">All caught up! No pending reviews.</div>
                ) : reviews.map((review) => (
                    <div key={review.id} className="p-6 hover:bg-muted/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{review.colleges?.name}</h3>
                                <p className="text-sm text-slate-500">Submitted by: {review.profiles?.email || 'Anonymous'} • Rating: {review.rating}/5</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => approve(review.id)} className="flex items-center gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 rounded-md font-bold text-sm transition-colors"><CheckCircle size={16} /> Approve</button>
                                <button onClick={() => reject(review.id)} className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-md font-bold text-sm transition-colors"><XCircle size={16} /> Reject</button>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm space-y-3">
                            <p className="text-slate-700 italic">"{review.comment}"</p>
                            <div className="flex gap-8 text-sm">
                                <div><span className="font-bold text-emerald-600">Pros:</span> {review.pros?.join(', ')}</div>
                                <div><span className="font-bold text-red-600">Cons:</span> {review.cons?.join(', ')}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
