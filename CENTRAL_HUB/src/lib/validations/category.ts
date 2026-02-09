import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  parentId: z.number().int().optional().nullable(),
})

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  parentId: z.number().int().optional().nullable(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
