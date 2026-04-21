import { createClient, type SanityClient } from '@sanity/client'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID?.trim() ?? ''

/** `null` when `PUBLIC_SANITY_PROJECT_ID` is missing (e.g. Vercel env not set); `createClient` throws on empty id. */
export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
      apiVersion: '2024-01-01',
      useCdn: true,
    })
  : null
