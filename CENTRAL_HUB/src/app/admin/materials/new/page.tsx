"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, X } from "lucide-react"
import FileUpload from "@/components/admin/FileUpload"

interface Category {
  id: number
  name: string
  slug: string
}

export default function NewMaterialPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    titleRo: '',
    titleEn: '',
    descriptionRo: '',
    descriptionEn: '',
    type: 'pdf' as 'pdf' | 'video' | 'image',
    fileUrl: null as string | null,
    categoryIds: [] as number[],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        // Flatten all categories including children
        const flattenCategories = (cats: any[]): Category[] => {
          const result: Category[] = []
          const flatten = (items: any[]) => {
            items.forEach(cat => {
              result.push({ id: cat.id, name: cat.name, slug: cat.slug })
              if (cat.children && cat.children.length > 0) {
                flatten(cat.children)
              }
            })
          }
          flatten(cats)
          return result
        }
        setCategories(flattenCategories(data.data))
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

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

      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Eroare la salvarea materialului')
      }

      router.push('/admin/materials')
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

  const selectedCategories = categories.filter(cat => formData.categoryIds.includes(cat.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/materials')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Adaugă Material Nou</h1>
          <p className="text-gray-600 mt-1">Completează detaliile materialului</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
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
              rows={4}
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
            <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/admin/materials')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Anulează
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Se salvează...' : 'Salvează Material'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
