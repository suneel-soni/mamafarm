import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-static';
import { connectToDatabase } from '@/lib/db';
import Expense from '@/models/Expense';
import ActivityLog from '@/models/ActivityLog';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET() {
  try {
    await connectToDatabase();
    const expenses = await Expense.find().sort({ expenseDate: -1 });

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const categoryBreakdown = expenses.reduce((acc: Record<string, number>, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: expenses,
      meta: {
        totalExpense,
        categoryBreakdown,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error fetching expenses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { title, category, amount, expenseDate, paymentMethod, notes } = body;

    const expense = await Expense.create({
      title,
      category,
      amount: Number(amount),
      expenseDate: expenseDate || new Date(),
      paymentMethod,
      notes,
    });

    await ActivityLog.create({
      action: 'Expense Added',
      description: `Recorded ₹${amount} for ${title} [${category}]`,
      entityType: 'Expense',
      entityId: String(expense._id),
    });

    return successResponse(expense, 'Expense recorded successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to record expense', 500);
  }
}
