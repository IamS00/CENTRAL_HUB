"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface Category {
  id: number
  name: string
  description: string | null
  parentId: number | null
}

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  category?: Category | null
  categories: Category[]
  defaultParentId?: number | null
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  category,
  categories,
  defaultParentId
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: defaultParentId || null as number | null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        parentId: category.parentId,
      })
    } else if (defaultParentId) {
      setFormData(prev => ({
        ...prev,
        parentId: defaultParentId
      }))
    }
  }, [category, defaultParentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Transform data for API
      const apiData = {
        name: formData.name,
        description: formData.description || null,
        parentId: formData.parentId,
      }
      await onSave(apiData)
      onClose()
      // Reset form
      setFormData({
        name: '',
        description: '',
        parentId: null,
      })
    } catch (err: any) {
      setError(err.message || 'Eroare la salvarea categoriei')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Filter out current category and its children from parent options
  const availableParents = categories.filter(c =>
    !category || (c.id !== category.id)
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {category ? 'Editează Categorie' : 'Adaugă Categorie'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nume *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="ex: Educație, Matematică, Literatură..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descriere
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Descrierea categoriei (opțional)..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categorie Părinte
            </label>
            <select
              value={formData.parentId || ''}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Niciuna (Categorie Principală)</option>
              {availableParents.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Anulează
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Se salvează...' : 'Salvează'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
