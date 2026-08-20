import { NextResponse } from 'next/server';
import { getContent, saveContent } from '../../../lib/content';
import { AUTH_COOKIE_NAME, isValidSessionToken } from '../../../lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await getContent();

    return NextResponse.json(content);
  } catch (err) {
    console.error('ERRO AO CARREGAR CONTEÚDO:', err);

    return NextResponse.json(
      { error: 'Erro ao carregar conteúdo' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token || !(await isValidSessionToken(token))) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const saved = await saveContent(body);

    return NextResponse.json({
      ok: true,
      content: saved,
    });
  } catch (err) {
    console.error('ERRO AO SALVAR CONTEÚDO:', err);

    return NextResponse.json(
      {
        error: 'Erro ao salvar conteúdo',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}