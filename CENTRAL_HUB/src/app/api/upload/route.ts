import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { isAdmin } from '@/lib/rbac'
import {
  saveFile,
  validateFileType,
  validateFileSize,
  FileType,
  MAX_FILE_SIZE
} from '@/lib/upload'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !isAdmin(session.user as any)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as FileType

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!type || !['pdf', 'video', 'image'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type specified' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!validateFileType(file, type)) {
      return NextResponse.json(
        { success: false, error: `Invalid file format for ${type}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (!validateFileSize(file, MAX_FILE_SIZE)) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        },
        { status: 400 }
      )
    }

    // Save file
    const fileUrl = await saveFile(file, type)

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
