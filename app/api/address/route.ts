import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, address, city, state, zip, default: isDefault } = body;

    // Validate required fields
    if (!name || !address || !city || !state || !zip) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If this is set as default, update other addresses to not be default
    if (isDefault) {
      const query = `*[_type == "address" && default == true]`;
      const defaultAddresses = await backendClient.fetch(query);
      
      for (const addr of defaultAddresses) {
        await backendClient
          .patch(addr._id)
          .set({ default: false })
          .commit();
      }
    }

    // Create the address
    const newAddress = await backendClient.create({
      _type: 'address',
      name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      default: isDefault,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      address: newAddress 
    });
  } catch (error: any) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { 
        error: error.message,
        details: 'Failed to create address. Please check your Sanity configuration.'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const query = `*[_type=="address"] | order(publishedAt desc)`;
    const addresses = await backendClient.fetch(query);
    
    return NextResponse.json({ 
      success: true, 
      addresses 
    });
  } catch (error: any) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { 
        error: error.message,
        details: 'Failed to fetch addresses.'
      },
      { status: 500 }
    );
  }
} 