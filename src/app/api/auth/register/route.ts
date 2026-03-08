// src/app/api/auth/register/route.ts
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';
import { RegisterSchema } from '@/lib/validations';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = RegisterSchema.safeParse(body);
    if (!result.success) return validationErrorResponse(result.error.flatten());

    const { email, password, username, displayName } = result.data;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username: username.toLowerCase() }] },
    });

    if (existing) {
      return errorResponse(
        existing.email === email ? 'Email already registered' : 'Username already taken',
        409
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        username: username.toLowerCase(),
        profile: {
          create: {
            displayName,
          },
        },
      },
      include: { profile: true },
    });

    const token = await signToken({
      sub: user.id,
      email: user.email,
      username: user.username,
      plan: user.plan,
    });

    setAuthCookie(token);

    return successResponse(
      { id: user.id, email: user.email, username: user.username, plan: user.plan },
      201
    );
  } catch (error) {
    console.error('[REGISTER]', error);
    return errorResponse('Registration failed', 500);
  }
}
