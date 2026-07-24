import { NextRequest } from 'next/server';
export const dynamic = 'force-static';
import { connectToDatabase } from '@/lib/db';
import Supplier from '@/models/Supplier';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET() {
  try {
    await connectToDatabase();
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    return successResponse(suppliers);
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching suppliers', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const supplier = await Supplier.create(body);
    return successResponse(supplier, 'Supplier created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create supplier', 500);
  }
}
