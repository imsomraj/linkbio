// src/app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';
import { LoginSchema } from '@/lib/validations';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = LoginSchema.safeParse(body);
    if (!result.success) return validationErrorResponse(result.error.flatten());

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return errorResponse('Invalid credentials', 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return errorResponse('Invalid credentials', 401);

    const token = await signToken({
      sub: user.id,
      email: user.email,
      username: user.username,
      plan: user.plan,
    });

    setAuthCookie(token);

    return successResponse({ id: user.id, email: user.email, username: user.username, plan: user.plan });
  } catch (error) {
    console.error('[LOGIN]', error);
    return errorResponse('Login failed', 500);
  }
}
