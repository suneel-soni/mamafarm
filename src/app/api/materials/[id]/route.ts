export function generateStaticParams() { return [{ id: 'stub' }]; }
import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/db';
import Material from '@/models/Material';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const material = await Material.findById(id).populate('supplier');
    if (!material) return errorResponse('Material not found', 404);
    return successResponse(material);
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching material', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();

    const material = await Material.findByIdAndUpdate(id, body, { new: true });
    if (!material) return errorResponse('Material not found', 404);
    return successResponse(material, 'Material updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update material', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const material = await Material.findByIdAndDelete(id);
    if (!material) return errorResponse('Material not found', 404);
    return successResponse(null, 'Material deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete material', 500);
  }
}
