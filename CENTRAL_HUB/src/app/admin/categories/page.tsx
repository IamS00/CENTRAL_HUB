"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import CategoryTree from "@/components/admin/CategoryTree"
import CategoryFormModal from "@/components/admin/CategoryFormModal"

interface Category {
  id: number
  name: string
  description: string | null
  slug: string
  parentId: number | null
  children?: Category[]
  _count?: {
    resources: number
    children: number
  }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [defaultParentId, setDefaultParentId] = useState<number | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?includeChildren=true')
      const data = await response.json()
      if (data.success) {
        // Build tree structure
        const tree = buildCategoryTree(data.data)
        setCategories(tree)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const buildCategoryTree = (flatCategories: Category[]): Category[] => {
    const map = new Map<string, Category>()
    const roots: Category[] = []

    // First pass: create map
    flatCategories.forEach(cat => {
      map.set(cat.id, { ...cat, children: [] })
    })

    // Second pass: build tree
    flatCategories.forEach(cat => {
      const node = map.get(cat.id)!
      if (cat.parentId) {
        const parent = map.get(cat.parentId)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(node)
        } else {
          roots.push(node)
        }
      } else {
        roots.push(node)
      }
    })

    return roots
  }

  const handleAddNew = () => {
    setEditingCategory(null)
    setDefaultParentId(null)
    setIsModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setDefaultParentId(null)
    setIsModalOpen(true)
  }

  const handleAddChild = (parentId: string) => {
    setEditingCategory(null)
    setDefaultParentId(parentId)
    setIsModalOpen(true)
  }

  const handleDelete = async (category: Category) => {
    if (!confirm(`Ești sigur că vrei să ștergi categoria "${category.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchCategories()
      } else {
        alert(data.error || 'Eroare la ștergerea categoriei')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Eroare la ștergerea categoriei')
    }
  }

  const handleSave = async (formData: any) => {
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories'

      const method = editingCategory ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Eroare la salvarea categoriei')
      }

      await fetchCategories()
    } catch (error) {
      throw error
    }
  }

  // Flatten categories for form parent selector
  const flattenCategories = (cats: Category[]): Category[] => {
    const result: Category[] = []
    const flatten = (items: Category[]) => {
      items.forEach(cat => {
        result.push(cat)
        if (cat.children) {
          flatten(cat.children)
        }
      })
    }
    flatten(cats)
    return result
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Se încarcă categoriile...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorii</h1>
          <p className="text-gray-600 mt-1">Gestionează categoriile și ierarhia conținutului</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Adaugă Categorie
        </button>
      </div>

      {/* Category Tree */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nu s-au găsit categorii. Adaugă prima categorie pentru a începe.
          </div>
        ) : (
          <CategoryTree
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddChild={handleAddChild}
          />
        )}
      </div>

      {/* Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category={editingCategory}
        categories={flattenCategories(categories)}
        defaultParentId={defaultParentId}
      />
    </div>
  )
}
