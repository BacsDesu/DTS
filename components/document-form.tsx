'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface DocumentFormProps {
  onSubmit: (data: any) => Promise<void>
}

export default function DocumentForm({ onSubmit }: DocumentFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    recipient: '',
    document_date: '',
    document_type: '',
    classification: '',
    subject: '',
    location: '',
    status: 'pending',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
      setFormData({
        recipient: '',
        document_date: '',
        document_type: '',
        classification: '',
        subject: '',
        location: '',
        status: 'pending',
      })
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4"
    >
      <h2 className="text-xl font-bold text-foreground mb-4">Add Document</h2>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Recipient
        </label>
        <input
          type="text"
          name="recipient"
          value={formData.recipient}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="e.g., John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Document Date
        </label>
        <input
          type="date"
          name="document_date"
          value={formData.document_date}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Document Type
        </label>
        <select
          name="document_type"
          value={formData.document_type}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Select type</option>
          <option value="Letter">Letter</option>
          <option value="Memo">Memo</option>
          <option value="Report">Report</option>
          <option value="Form">Form</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Classification
        </label>
        <select
          name="classification"
          value={formData.classification}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Select classification</option>
          <option value="Public">Public</option>
          <option value="Internal">Internal</option>
          <option value="Confidential">Confidential</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Subject
        </label>
        <textarea
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Document subject"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Document location"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={20} />
        {loading ? 'Adding...' : 'Add Document'}
      </button>
    </form>
  )
}
