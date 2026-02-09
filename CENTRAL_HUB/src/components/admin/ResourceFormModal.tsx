"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import FileUpload from "./FileUpload"

interface Category {
  id: number
  name: string
  slug: string
}

interface Resource {
  id: string
  titleRo: string
  titleEn?: string | null
  descriptionRo?: string | null
  descriptionEn?: string | null
  type: 'pdf' | 'video' | 'image'
  fileUrl: string | null
  thumbnailUrl?: string | null
  storeAssociation?: string | null
  categories: Category[]
}

interface ResourceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  resource?: Resource | null
  categories: Category[]
}

export default function ResourceFormModal({
  isOpen,
  onClose,
  onSave,
  resource,
  categories
}: ResourceFormModalProps) {
  const [formData, setFormData] = useState({
    titleRo: '',
    titleEn: '',
    descriptionRo: '',
    descriptionEn: '',
    type: 'pdf' as 'pdf' | 'video' | 'image',
    fileUrl: null as string | null,
    thumbnailUrl: null as string | null,
    categoryIds: [] as number[],
    storeAssociation: null as string | null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (resource) {
      setFormData({
        titleRo: resource.titleRo,
        titleEn: resource.titleEn || '',
        descriptionRo: resource.descriptionRo || '',
        descriptionEn: resource.descriptionEn || '',
        type: resource.type,
        fileUrl: resource.fileUrl,
        thumbnailUrl: resource.thumbnailUrl || null,
        categoryIds: resource.categories.map(cat => cat.id),
        storeAssociation: resource.storeAssociation,
      })
    } else {
      setFormData({
        titleRo: '',
        titleEn: '',
        descriptionRo: '',
        descriptionEn: '',
        type: 'pdf',
        fileUrl: null,
        thumbnailUrl: null,
        categoryIds: [],
        storeAssociation: null,
      })
    }
  }, [resource])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validation
      if (!formData.titleRo.trim()) {
        throw new Error('Titlul este obligatoriu')
      }
      if (formData.categoryIds.length === 0) {
        throw new Error('Selectează cel puțin o categorie')
      }
      if (!formData.fileUrl) {
        throw new Error('Încarcă un fișier')
      }

      await onSave(formData)
      onClose()
      // Reset form
      setFormData({
        titleRo: '',
        titleEn: '',
        descriptionRo: '',
        descriptionEn: '',
        type: 'pdf',
        fileUrl: null,
        thumbnailUrl: null,
        categoryIds: [],
        storeAssociation: null,
      })
    } catch (err: any) {
      setError(err.message || 'Eroare la salvarea materialului')
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }))
  }

  const removeCategory = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.filter(id => id !== categoryId)
    }))
  }

  if (!isOpen) return null

  const selectedCategories = categories.filter(cat => formData.categoryIds.includes(cat.id))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {resource ? 'Editează Material' : 'Adaugă Material'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titlu Material *
            </label>
            <input
              type="text"
              value={formData.titleRo}
              onChange={(e) => setFormData({ ...formData, titleRo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="ex: Ghid de Matematică Clasa a 5-a"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descriere
            </label>
            <textarea
              value={formData.descriptionRo}
              onChange={(e) => setFormData({ ...formData, descriptionRo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Descrie conținutul materialului..."
              rows={3}
            />
          </div>

          {/* Material Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tip Material *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="pdf"
                  checked={formData.type === 'pdf'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any, fileUrl: null })}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">PDF</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="video"
                  checked={formData.type === 'video'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any, fileUrl: null })}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">Video</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="image"
                  checked={formData.type === 'image'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any, fileUrl: null })}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">Imagine</span>
              </label>
            </div>
          </div>

          {/* File Upload */}
          <FileUpload
            type={formData.type}
            onUpload={(fileUrl) => setFormData({ ...formData, fileUrl })}
            currentFile={formData.fileUrl}
            label="Fișier Material *"
          />

          {/* Thumbnail Upload (only for videos) */}
          {formData.type === 'video' && (
            <FileUpload
              type="image"
              onUpload={(fileUrl) => setFormData({ ...formData, thumbnailUrl: fileUrl })}
              currentFile={formData.thumbnailUrl}
              label="Thumbnail Video (opțional)"
            />
          )}

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorii * (selectează una sau mai multe)
            </label>

            {/* Selected Categories as Tags */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedCategories.map(cat => (
                  <span
                    key={cat.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {cat.name}
                    <button
                      type="button"
                      onClick={() => removeCategory(cat.id)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Category Selection */}
            <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
              {categories.length === 0 ? (
                <p className="text-sm text-gray-500">Nu există categorii. Adaugă mai întâi o categorie.</p>
              ) : (
                categories.map(cat => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="w-4 h-4 text-primary focus:ring-primary rounded"
                    />
                    <span className="text-gray-700">{cat.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Store Association */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asociere Magazin
            </label>
            <select
              value={formData.storeAssociation || ''}
              onChange={(e) => setFormData({ ...formData, storeAssociation: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Niciuna (Global)</option>
              <option value="printings">Printings</option>
              <option value="numlit">Numlit</option>
              <option value="global">Global</option>
            </select>
          </div>

          {/* Action Buttons */}
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
              {loading ? 'Se salvează...' : 'Salvează Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
