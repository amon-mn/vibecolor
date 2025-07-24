// Para validação, instale zod: pnpm add zod
import { z } from 'zod';

export const IColorSchema = z.object({
  hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  rgb: z.tuple([z.number().min(0).max(255), z.number().min(0).max(255), z.number().min(0).max(255)]),
  luminance: z.number().min(0).max(1),
  contrastBlack: z.number(),
  contrastWhite: z.number(),
  isAccessibleAA: z.boolean(),
  isAccessibleAAA: z.boolean(),
});

export const IPaletteInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  colors: z.array(IColorSchema),
  emotionOrStyle: z.string().min(1),
});

export type IPaletteInputType = z.infer<typeof IPaletteInputSchema>; 