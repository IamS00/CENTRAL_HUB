import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { isAdmin } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'
import { createResourceSchema } from '@/lib/validations/resource'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await prisma.resource.findUnique({
      where: {
        id: params.id
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    if (!resource) {
      return NextResponse.json(
        { success: false, error: 'Resursa nu a fost găsită' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: resource
    })
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json(
      { success: false, error: 'Eroare la încărcarea resursei' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !isAdmin(session.user as any)) {
      return NextResponse.json(
        { success: false, error: 'Neautorizat' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate request body
    const validationResult = createResourceSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Date invalide',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { categoryIds, metadata, ...resourceData } = validationResult.data

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id: params.id }
    })

    if (!existingResource) {
      return NextResponse.json(
        { success: false, error: 'Resursa nu a fost găsită' },
        { status: 404 }
      )
    }

    // Verify all categories exist
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds
        }
      }
    })

    if (categories.length !== categoryIds.length) {
      return NextResponse.json(
        { success: false, error: 'Una sau mai multe categorii nu există' },
        { status: 400 }
      )
    }

    // Update resource with new category associations
    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        ...resourceData,
        title: resourceData.titleRo, // Update title to Romanian title
        description: resourceData.descriptionRo || null, // Update description to Romanian description
        ...(metadata && { metadata: metadata as any }), // Type assertion for Prisma JSON
        categories: {
          set: [], // Clear existing associations
          connect: categoryIds.map(id => ({ id })) // Create new associations
        }
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: resource,
      message: 'Resursă actualizată cu succes'
    })
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json(
      { success: false, error: 'Eroare la actualizarea resursei' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !isAdmin(session.user as any)) {
      return NextResponse.json(
        { success: false, error: 'Neautorizat' },
        { status: 401 }
      )
    }

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id: params.id }
    })

    if (!existingResource) {
      return NextResponse.json(
        { success: false, error: 'Resursa nu a fost găsită' },
        { status: 404 }
      )
    }

    // Delete resource (this will automatically disconnect category associations)
    await prisma.resource.delete({
      where: { id: params.id }
    })

    // TODO: Delete associated files from disk
    // if (existingResource.fileUrl) {
    //   deleteFileFromDisk(existingResource.fileUrl)
    // }
    // if (existingResource.thumbnailUrl) {
    //   deleteFileFromDisk(existingResource.thumbnailUrl)
    // }

    return NextResponse.json({
      success: true,
      message: 'Resursă ștearsă cu succes'
    })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { success: false, error: 'Eroare la ștergerea resursei' },
      { status: 500 }
    )
  }
}
