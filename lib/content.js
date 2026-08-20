import { put, list } from '@vercel/blob';

const CONTENT_FILE_NAME = 'content.json';

/**
 * Busca o content.json armazenado no Vercel Blob.
 *
 * O Blob é privado, então a leitura é feita no servidor.
 */
export async function getContent() {
  try {
    const { blobs } = await list({
      prefix: CONTENT_FILE_NAME,
    });

    const contentBlob = blobs.find(
      (blob) => blob.pathname === CONTENT_FILE_NAME
    );

    if (!contentBlob) {
      throw new Error('content.json não encontrado no Vercel Blob');
    }

    const response = await fetch(contentBlob.url, {
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
 * Salva/substitui o conteúdo inteiro no Vercel Blob.
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