'use client'

import { useState } from 'react'
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export default function BulkImporter() {
    const { token } = useAuth()
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{success?: boolean, message?: string} | null>(null)

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true)
        setStatus(null)
        
        const fd = new FormData()
        fd.append('file', file)
        
        try {
            const res = await fetch('http://localhost:8000/admin/colleges/bulk', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: fd
            })
            const data = await res.json()
            if (data.success) {
                setStatus({ success: true, message: `Successfully imported ${data.inserted} colleges!` })
                setFile(null)
            } else {
                setStatus({ success: false, message: data.error || 'Failed to import.' })
            }
        } catch(e) {
            setStatus({ success: false, message: 'Server connection failed.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-card p-10 rounded-xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold text-secondary text-center mb-2">Bulk Upload Colleges</h2>
            <p className="text-muted-foreground text-center mb-8">Upload a CSV file containing `name, slug, location, nirf_rank, accreditation, description` columns.</p>
            
            <div 
                className={cn(
                    "border-2 border-dashed rounded-xl p-16 text-center transition-colors relative",
                    file ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary/50"
                )}
            >
                <input 
                    type="file" 
                    accept=".csv" 
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="mx-auto mb-4 text-slate-400" size={48} />
                <h3 className="text-lg font-bold text-slate-700">{file ? file.name : "Drag & Drop CSV File"}</h3>
                <p className="text-sm text-slate-500 mt-1">{file ? "Click to replace file" : "or click to browse"}</p>
            </div>
            
            {status && (
                <div className={cn("mt-6 p-4 rounded-lg flex items-center gap-3 font-bold", status.success ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800")}>
                    {status.success ? <CheckCircle2 /> : <AlertCircle />} {status.message}
                </div>
            )}
            
            <button 
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full mt-8 py-3 rounded-lg font-bold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
            >
                {loading ? 'Processing...' : 'Upload Database'}
            </button>
        </div>
    )
}
