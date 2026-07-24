export function generateStaticParams() { return [{ id: 'stub' }]; }
import { NextRequest } from 'next/server';
export const dynamic = 'force-static';
import { connectToDatabase } from '@/lib/db';
import Expense from '@/models/Expense';
import { successResponse, errorResponse } from '@/helpers/response';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) return errorResponse('Expense not found', 404);
    return successResponse(null, 'Expense deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete expense', 500);
  }
}
