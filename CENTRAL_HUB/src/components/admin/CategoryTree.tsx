"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Edit, Trash2, Plus, FolderOpen, Folder, FileText } from "lucide-react"

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

interface CategoryTreeProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onAddChild: (parentId: number) => void
}

export default function CategoryTree({
  categories,
  onEdit,
  onDelete,
  onAddChild
}: CategoryTreeProps) {
  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <CategoryTreeItem
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
          level={0}
        />
      ))}
    </div>
  )
}

interface CategoryTreeItemProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onAddChild: (parentId: number) => void
  level: number
}

function CategoryTreeItem({
  category,
  onEdit,
  onDelete,
  onAddChild,
  level
}: CategoryTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = (category.children?.length || 0) > 0

  return (
    <div>
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg group"
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {/* Category Icon */}
        {hasChildren ? (
          isExpanded ? (
            <FolderOpen className="w-5 h-5 text-blue-500 flex-shrink-0" />
          ) : (
            <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />
          )
        ) : (
          <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{category.name}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500">{category.slug}</span>
            {category._count && (
              <>
                <span className="text-xs text-gray-500">
                  {category._count.resources} resurse
                </span>
                {category._count.children > 0 && (
                  <span className="text-xs text-gray-500">
                    {category._count.children} subcategorii
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddChild(category.id)}
            className="p-2 hover:bg-gray-200 rounded text-gray-600"
            title="Adaugă subcategorie"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(category)}
            className="p-2 hover:bg-yellow-200 rounded text-yellow-600"
            title="Editează"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-2 hover:bg-gray-200 rounded text-red-600"
            title="Șterge"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div>
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
