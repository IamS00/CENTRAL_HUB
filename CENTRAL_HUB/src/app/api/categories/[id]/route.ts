import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/rbac'
import { updateCategorySchema } from '@/lib/validations/category'
import { z } from 'zod'

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// GET - Single category
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        parent: true,
        children: {
          include: {
            children: true,
          }
        },
        _count: {
          select: {
            resources: true,
            children: true,
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PATCH - Update category (Admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !isAdmin(session.user as any)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateCategorySchema.parse(body)

    const categoryId = parseInt(params.id)

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    // Prevent circular parent relationship
    if (validatedData.parentId === categoryId) {
      return NextResponse.json(
        { success: false, error: 'Category cannot be its own parent' },
        { status: 400 }
      )
    }

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

    // Generate new slug if name is being updated
    let slug = existingCategory.slug
    if (validatedData.name) {
      const baseSlug = generateSlug(validatedData.name)

      // Check slug uniqueness (excluding current category)
      let finalSlug = baseSlug
      let counter = 1
      while (true) {
        const existing = await prisma.category.findUnique({
          where: { slug: finalSlug }
        })
        if (!existing || existing.id === categoryId) break
        finalSlug = `${baseSlug}-${counter}`
        counter++
      }
      slug = finalSlug
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        slug,
        parentId: validatedData.parentId,
      },
      include: {
        parent: true,
        children: true,
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
    })
  } catch (error) {
    console.error('Error updating category:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE - Delete category (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !isAdmin(session.user as any)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const categoryId = parseInt(params.id)

    // Check if category has children
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: true,
        _count: {
          select: { resources: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    if (category.children.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category with subcategories' },
        { status: 400 }
      )
    }

    if (category._count.resources > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category with ${category._count.resources} associated resources`
        },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: categoryId }
    })

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
