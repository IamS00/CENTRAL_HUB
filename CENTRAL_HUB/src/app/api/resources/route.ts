import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { isAdmin } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'
import { createResourceSchema } from '@/lib/validations/resource'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const storeAssociation = searchParams.get('storeAssociation')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const where: any = {}

    if (categoryId) {
      where.categories = {
        some: {
          id: parseInt(categoryId)
        }
      }
    }

    if (type && ['pdf', 'video', 'image', 'link', 'redirect'].includes(type)) {
      where.type = type
    }

    if (storeAssociation && ['printings', 'numlit', 'global'].includes(storeAssociation)) {
      where.storeAssociation = storeAssociation
    }

    if (search) {
      where.OR = [
        { titleRo: { contains: search } },
        { titleEn: { contains: search } },
        { descriptionRo: { contains: search } },
        { descriptionEn: { contains: search } }
      ]
    }

    // Get total count
    const total = await prisma.resource.count({ where })

    // Get resources with pagination
    const resources = await prisma.resource.findMany({
      where,
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json({
      success: true,
      data: resources,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { success: false, error: 'Eroare la încărcarea resurselor' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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

    // Create resource with category associations
    const resource = await prisma.resource.create({
      data: {
        ...resourceData,
        title: resourceData.titleRo, // Set title to Romanian title
        description: resourceData.descriptionRo || null, // Set description to Romanian description
        ...(metadata && { metadata: metadata as any }), // Type assertion for Prisma JSON
        categories: {
          connect: categoryIds.map(id => ({ id }))
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
      message: 'Resursă creată cu succes'
    })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { success: false, error: 'Eroare la crearea resursei' },
      { status: 500 }
    )
  }
}
