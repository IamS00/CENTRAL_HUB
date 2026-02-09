import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
export const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

export const ALLOWED_FILE_TYPES = {
  pdf: ['application/pdf'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}

export type FileType = keyof typeof ALLOWED_FILE_TYPES

export async function ensureUploadDir(subdir: string = '') {
  const targetDir = path.join(UPLOAD_DIR, subdir)
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true })
  }
  return targetDir
}

export function validateFileType(file: File, allowedType: FileType): boolean {
  return ALLOWED_FILE_TYPES[allowedType].includes(file.type)
}

export function validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): boolean {
  return file.size <= maxSize
}

export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = path.extname(originalName)
  const nameWithoutExt = path.basename(originalName, ext)
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_')
  return `${sanitizedName}_${timestamp}_${random}${ext}`
}

export async function saveFile(
  file: File,
  subdir: string
): Promise<string> {
  const dir = await ensureUploadDir(subdir)
  const filename = generateUniqueFilename(file.name)
  const filepath = path.join(dir, filename)

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  await writeFile(filepath, buffer)

  // Return public URL path
  return `/uploads/${subdir}/${filename}`
}

export interface UploadResult {
  success: boolean
  fileUrl?: string
  error?: string
}
