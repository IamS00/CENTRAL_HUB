import { z } from 'zod'

export const createResourceSchema = z.object({
  titleRo: z.string().min(1, 'Titlul în română este obligatoriu'),
  titleEn: z.string().optional().nullable(),
  descriptionRo: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  type: z.enum(['pdf', 'video', 'image', 'link', 'redirect'], {
    errorMap: () => ({ message: 'Tip invalid de resursă' })
  }),
  fileUrl: z.string().optional().nullable(),
  externalLink: z.string().url('Link extern invalid').optional().nullable(),
  categoryIds: z.array(z.number().int()).min(1, 'Selectează cel puțin o categorie'),
  metadata: z.record(z.unknown()).optional().nullable(),
}).refine(
  (data) => {
    // If type is pdf, video, or image, fileUrl is required
    if (['pdf', 'video', 'image'].includes(data.type)) {
      return !!data.fileUrl
    }
    // If type is link or redirect, externalLink is required
    if (['link', 'redirect'].includes(data.type)) {
      return !!data.externalLink
    }
    return true
  },
  {
    message: 'Fișier sau link extern este obligatoriu în funcție de tipul resursei',
    path: ['fileUrl']
  }
)

export const updateResourceSchema = z.object({
  titleRo: z.string().min(1, 'Titlul în română este obligatoriu').optional(),
  titleEn: z.string().optional().nullable(),
  descriptionRo: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  type: z.enum(['pdf', 'video', 'image', 'link', 'redirect']).optional(),
  fileUrl: z.string().optional().nullable(),
  externalLink: z.string().url('Link extern invalid').optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional().nullable(),
})

export type CreateResourceInput = z.infer<typeof createResourceSchema>
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>
