"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, FileText, Film, Image as ImageIcon, Loader2 } from "lucide-react"

type FileType = 'pdf' | 'video' | 'image'

interface FileUploadProps {
  type: FileType
  onUpload: (fileUrl: string) => void
  currentFile?: string | null
  label?: string
}

const FILE_TYPE_ACCEPTS = {
  pdf: { accept: '.pdf', mime: ['application/pdf'] },
  video: { accept: '.mp4,.webm,.ogg', mime: ['video/mp4', 'video/webm', 'video/ogg'] },
  image: { accept: '.jpg,.jpeg,.png,.gif,.webp', mime: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] }
}

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

export default function FileUpload({ type, onUpload, currentFile, label }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentFile || null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`Fișierul este prea mare. Maxim ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
      return false
    }

    // Check file type
    const allowedMimes = FILE_TYPE_ACCEPTS[type].mime
    if (!allowedMimes.includes(file.type)) {
      setError(`Tip de fișier invalid. Selectează un fișier ${type.toUpperCase()}`)
      return false
    }

    setError(null)
    return true
  }

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Eroare la încărcare')
      }

      setPreview(data.fileUrl)
      onUpload(data.fileUrl)
    } catch (err: any) {
      setError(err.message || 'Eroare la încărcarea fișierului')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }, [type])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const renderPreview = () => {
    if (!preview) return null

    switch (type) {
      case 'image':
        return (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg border border-gray-200"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )

      case 'video':
        return (
          <div className="relative group">
            <video
              src={preview}
              controls
              className="max-h-64 mx-auto rounded-lg border border-gray-200"
            >
              Browser-ul tău nu suportă video.
            </video>
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )

      case 'pdf':
        return (
          <div className="relative group bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <FileText className="w-12 h-12 text-red-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">PDF Încărcat</p>
                <a
                  href={preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Vezi PDF
                </a>
              </div>
              <button
                onClick={handleRemove}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'image': return <ImageIcon className="w-12 h-12 text-gray-400" />
      case 'video': return <Film className="w-12 h-12 text-gray-400" />
      case 'pdf': return <FileText className="w-12 h-12 text-gray-400" />
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'image': return 'imagine (JPG, PNG, GIF, WEBP)'
      case 'video': return 'video (MP4, WEBM, OGG)'
      case 'pdf': return 'PDF'
    }
  }

  if (preview) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        {renderPreview()}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={FILE_TYPE_ACCEPTS[type].accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        <div className="space-y-4">
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
              <p className="text-sm text-gray-600">Se încarcă...</p>
            </>
          ) : (
            <>
              <div className="mx-auto">
                {getIcon()}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Click pentru a încărca
                </button>
                <span className="text-gray-600"> sau trage și plasează</span>
              </div>
              <p className="text-xs text-gray-500">
                Încarcă o {getTypeLabel()}
                <br />
                Maxim {MAX_FILE_SIZE / (1024 * 1024)}MB
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
