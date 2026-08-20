import { NextResponse } from 'next/server';

import { getContent, saveContent } from '../../../lib/content';

import {
  AUTH_COOKIE_NAME,
  isValidSessionToken,
} from '../../../lib/auth';

import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * GET
 *
 * Retorna o conteúdo atual armazenado no Vercel Blob.
 */
export async function GET() {
  try {
    const content = await getContent();

    return NextResponse.json(content);
  } catch (error) {
    console.error('Erro ao carregar conteúdo:', error);

    return NextResponse.json(
      {
        error: 'Erro ao carregar conteúdo',
        details: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * PUT
 *
 * Atualiza o conteúdo do site.
 * Apenas usuários autenticados podem salvar.
 */
export async function PUT(request) {
  try {
    const cookieStore = cookies();

    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token || !(await isValidSessionToken(token))) {
      return NextResponse.json(
        {
          error: 'Não autorizado',
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          error: 'Payload inválido',
        },
        {
          status: 400,
        }
      );
    }

    const saved = await saveContent(body);

    return NextResponse.json({
      ok: true,
      content: saved,
    });
  } catch (error) {
    console.error('Erro ao salvar conteúdo:', error);

    return NextResponse.json(
      {
        error: 'Erro ao salvar conteúdo',
        details: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}