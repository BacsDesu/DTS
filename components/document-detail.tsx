'use client'

import { X } from 'lucide-react'

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

interface DocumentDetailProps {
  document: Document
  onClose: () => void
}

export default function DocumentDetail({ document, onClose }: DocumentDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold text-foreground">Document Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-medium text-secondary uppercase tracking-wide">
              Recipient
            </p>
            <p className="text-sm text-foreground font-medium mt-1">
              {document.recipient}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-secondary uppercase tracking-wide">
                Type
              </p>
              <p className="text-sm text-foreground font-medium mt-1">
                {document.document_type}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-secondary uppercase tracking-wide">
                Status
              </p>
              <p className="text-sm text-foreground font-medium mt-1">
                {document.status.replace('_', ' ')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-secondary uppercase tracking-wide">
                Date
              </p>
              <p className="text-sm text-foreground font-medium mt-1">
                {new Date(document.document_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-secondary uppercase tracking-wide">
                Classification
              </p>
              <p className="text-sm text-foreground font-medium mt-1">
                {document.classification || 'N/A'}
              </p>
            </div>
          </div>

          {document.subject && (
            <div>
              <p className="text-xs font-medium text-secondary uppercase tracking-wide">
                Subject
              </p>
              <p className="text-sm text-foreground mt-1">{document.subject}</p>
            </div>
          )}

          {document.location && (
            <div>
              <p className="text-xs font-medium text-secondary uppercase tracking-wide">
                Location
              </p>
              <p className="text-sm text-foreground font-medium mt-1">
                {document.location}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-secondary uppercase tracking-wide">
              Created
            </p>
            <p className="text-sm text-foreground font-medium mt-1">
              {new Date(document.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
