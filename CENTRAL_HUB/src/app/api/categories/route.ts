import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/rbac'
import { createCategorySchema } from '@/lib/validations/category'

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// GET - List all categories with hierarchy
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeChildren = searchParams.get('includeChildren') === 'true'

    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: includeChildren ? {
          include: {
            children: true, // Support 2 levels deep
          }
        } : false,
        _count: {
          select: {
            resources: true,
            children: true,
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST - Create new category (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !isAdmin(session.user as any)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    // Validate parent exists if parentId provided
    if (validatedData.parentId) {
      const parentExists = await prisma.category.findUnique({
        where: { id: validatedData.parentId }
      })

      if (!parentExists) {
        return NextResponse.json(
          { success: false, error: 'Parent category not found' },
          { status: 400 }
        )
      }
    }

    // Generate slug from name
    const slug = generateSlug(validatedData.name)

    // Check slug uniqueness and add counter if needed
    let finalSlug = slug
    let counter = 1
    while (await prisma.category.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`
      counter++
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        slug: finalSlug,
        parentId: validatedData.parentId,
      },
      include: {
        parent: true,
        _count: {
          select: {
            resources: true,
            children: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: category,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
