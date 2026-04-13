'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import DocumentForm from '@/components/document-form'
import DocumentList from '@/components/document-list'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)
      loadDocuments()
    }

    checkUser()
  }, [])

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDocument = async (documentData: any) => {
    try {
      const { data, error } = await supabase.from('logs').insert([
        {
          user_id: user?.id,
          ...documentData,
        },
      ])

      if (error) throw error

      loadDocuments()
    } catch (error) {
      console.error('Error adding document:', error)
    }
  }

  const handleDeleteDocument = async (id: string) => {
    try {
      const { error } = await supabase.from('logs').delete().eq('id', id)

      if (error) throw error

      loadDocuments()
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DocumentForm onSubmit={handleAddDocument} />
          </div>
          <div className="lg:col-span-2">
            <DocumentList
              documents={documents}
              onDelete={handleDeleteDocument}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
