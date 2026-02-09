"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, FileText, Film, Image as ImageIcon, Edit, Trash2 } from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
}

interface Material {
  id: string
  titleRo: string
  titleEn?: string | null
  descriptionRo?: string | null
  descriptionEn?: string | null
  type: 'pdf' | 'video' | 'image'
  fileUrl: string | null
  thumbnailUrl: string | null
  categories: Category[]
  storeAssociation: string | null
  createdAt: string
}

export default function AdminMaterialsPage() {
  const router = useRouter()
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/resources')
      const data = await response.json()
      if (data.success) {
        setMaterials(data.data)
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    router.push('/admin/materials/new')
  }

  const handleEdit = (material: Material) => {
    router.push(`/admin/materials/edit/${material.id}`)
  }

  const handleDelete = async (material: Material) => {
    if (!confirm(`Ești sigur că vrei să ștergi "${material.titleRo}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/resources/${material.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchMaterials()
      } else {
        alert(data.error || 'Eroare la ștergerea materialului')
      }
    } catch (error) {
      console.error('Error deleting material:', error)
      alert('Eroare la ștergerea materialului')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />
      case 'video':
        return <Film className="w-5 h-5 text-purple-500" />
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-500" />
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      pdf: 'bg-red-100 text-red-700',
      video: 'bg-purple-100 text-purple-700',
      image: 'bg-blue-100 text-blue-700',
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Se încarcă materialele...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Materiale</h1>
          <p className="text-gray-600 mt-1">Gestionează PDF-uri, videoclipuri și imagini</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Adaugă Material
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {materials.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nu s-au găsit materiale. Adaugă primul material pentru a începe.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titlu & Categorii
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {material.type === 'image' && material.fileUrl ? (
                        <img
                          src={material.fileUrl}
                          alt={material.titleRo}
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ) : material.type === 'video' && material.thumbnailUrl ? (
                        <img
                          src={material.thumbnailUrl}
                          alt={material.titleRo}
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded border border-gray-200">
                          {getTypeIcon(material.type)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{material.titleRo}</div>
                        {material.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {material.categories.map((cat) => (
                              <span
                                key={cat.id}
                                className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                {cat.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getTypeBadge(material.type)}`}>
                        {material.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(material)}
                        className="text-primary hover:text-blue-700 mr-3"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(material)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
