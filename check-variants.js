// Script to check product variants in Sanity database
const { createClient } = require('@sanity/client');

// Create a client with hardcoded credentials from .env
const client = createClient({
  projectId: 'nowyiiix',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function getVariants() {
  try {
    // Query all product variants
    const variants = await client.fetch('*[_type == "product"].variant');
    console.log('Unique product variants:', [...new Set(variants)]);
    
    // Check if memory variant exists
    const memoryProducts = await client.fetch('*[_type == "product" && variant == "memory"]');
    console.log('Memory products count:', memoryProducts.length);
    if (memoryProducts.length > 0) {
      console.log('Sample memory product:', memoryProducts[0].name);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

getVariants();