import { NextResponse } from 'next/server';
import { checkPassword, createSessionToken, AUTH_COOKIE_NAME } from '../../../lib/auth';

export async function POST(request) {
  const { password } = await request.json();

  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 horas
  });
  return response;
}
