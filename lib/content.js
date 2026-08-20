import { put, list, head } from '@vercel/blob';

const CONTENT_FILE_NAME = 'content.json';

/**
 * Busca o conteúdo armazenado no Vercel Blob.
 */
export async function getContent() {
  try {
    const result = await head(CONTENT_FILE_NAME);

    if (!result) {
      throw new Error('content.json não encontrado no Vercel Blob');
    }

    const response = await fetch(result.url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao ler content.json: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error);
    throw error;
  }
}

/**
 * Salva o conteúdo no Vercel Blob.
 */
export async function saveContent(newContent) {
  try {
    await put(
      CONTENT_FILE_NAME,
      JSON.stringify(newContent, null, 2),
      {
        access: 'private',
        allowOverwrite: true,
        contentType: 'application/json',
      }
    );

    return newContent;
  } catch (error) {
    console.error('Erro ao salvar conteúdo:', error);
    throw error;
  }
}