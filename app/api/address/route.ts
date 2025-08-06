import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, email, phone, address, city, state, zip, default: isDefault, clerkUserId } = body;

    // Validate required fields
    if (!name || !address || !city || !state || !zip) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate state format (2 uppercase letters)
    if (!/^[A-Z]{2}$/.test(state)) {
      return NextResponse.json(
        { error: 'State must be 2 uppercase letters (e.g., NY, CA)' },
        { status: 400 }
      );
    }

    // Validate ZIP code format
    if (!/^\d{5}(-\d{4})?$/.test(zip)) {
      return NextResponse.json(
        { error: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)' },
        { status: 400 }
      );
    }

    // If this is set as default, update other addresses to not be default
    if (isDefault) {
      const query = `*[_type == "address" && default == true && clerkUserId == $userId]`;
      const defaultAddresses = await backendClient.fetch(query, { userId });
      
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
      clerkUserId: userId,
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
        details: 'Failed to create address. Please try again.'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const query = `*[_type=="address" && clerkUserId == $userId] | order(createdAt desc)`;
    const addresses = await backendClient.fetch(query, { userId });
    
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