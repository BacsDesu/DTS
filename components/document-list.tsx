'use client'

import { Trash2, Eye } from 'lucide-react'
import { useState } from 'react'
import DocumentDetail from './document-detail'

interface Document {
  id: string
  recipient: string
  document_date: string
  document_type: string
  classification: string
  subject: string
  location: string
  status: string
  created_at: string
}

interface DocumentListProps {
  documents: Document[]
  onDelete: (id: string) => Promise<void>
}

export default function DocumentList({ documents, onDelete }: DocumentListProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    setDeleting(id)
    try {
      await onDelete(id)
    } finally {
      setDeleting(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">No documents yet. Add your first document to get started!</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Documents</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                    Recipient
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      {doc.recipient}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      {doc.document_type}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      {new Date(doc.document_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye size={18} className="text-primary" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={deleting === doc.id}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete document"
                        >
                          <Trash2 size={18} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedDocument && (
        <DocumentDetail
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </>
  )
}
