import { NextResponse } from 'next/server';
import { getContent, saveContent } from '../../../lib/content';
import { AUTH_COOKIE_NAME, isValidSessionToken } from '../../../lib/auth';
import { cookies } from 'next/headers';

// Evita que o Next.js otimize esta rota como estática (o que bloquearia o método PUT)
export const dynamic = 'force-dynamic';

export async function GET() {
  const content = getContent();
  return NextResponse.json(content);
}

export async function PUT(request) {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!token || !(await isValidSessionToken(token))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const saved = saveContent(body);
    return NextResponse.json({ ok: true, content: saved });
  } catch (err) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }
}
