import { defineLive } from "next-sanity";
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({ 
  client: client.withConfig({ 
    apiVersion: '2025-01-01',   // ✅ Correct API version
    perspective: 'published'    // ✅ Optional: sirf published content dikhega
  }) 
});
