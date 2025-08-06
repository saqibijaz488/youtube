import { defineLive } from "next-sanity";
import { backendClient } from './backendClient'

export const { sanityFetch, SanityLive } = defineLive({ 
  client: backendClient.withConfig({ 
    apiVersion: '2025-01-01',   // ✅ Correct API version
    perspective: 'published'    // ✅ Optional: sirf published content dikhega
  }) 
});
