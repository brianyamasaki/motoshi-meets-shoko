// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
// 2. Define your collection(s)
const entryCollection = defineCollection({
  schema: z.object({
    date: z.string(),
    dayOfYear: z.number(),
    textImage: z.string(),
    relatedPhotos: z.array(z.object({
      imgSrc: z.string(),
      label: z.string()
    })).optional()
  })
 });
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  'entries': entryCollection,
};