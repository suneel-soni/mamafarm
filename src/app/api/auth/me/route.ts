import { NextRequest } from 'next/server';
export const dynamic = 'force-static';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { authenticateRequest } from '@/helpers/auth';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET(req: NextRequest) {
  try {
    const userPayload = authenticateRequest(req);
    if (!userPayload) {
      return errorResponse('Unauthorized access', 401);
    }

    await connectToDatabase();

    let user;
    if (userPayload.id && userPayload.id !== 'user_8130188878') {
      user = await User.findById(userPayload.id).select('-password');
    }

    if (!user) {
      if (userPayload.id === 'user_8130188878' || userPayload.phone === '8130188878') {
        return successResponse({
          id: 'user_8130188878',
          name: 'MamaFarm Owner',
          phone: '8130188878',
          role: 'admin',
        });
      }
      return errorResponse('User not found', 404);
    }

    return successResponse(user);
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching user profile', 500);
  }
}
