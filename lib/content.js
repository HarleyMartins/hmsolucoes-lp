import fs from 'fs';
import path from 'path';
import { put, list } from '@vercel/blob';

const CONTENT_FILE = 'content.json';

const CONTENT_PATH = path.join(
  process.cwd(),
  'data',
  'content.json'
);

export async function getContent() {
  const { blobs } = await list({
    prefix: CONTENT_FILE,
    limit: 1,
  });

  if (blobs.length) {
    const response = await fetch(blobs[0].url, {
      cache: 'no-store',
    });

    if (response.ok) {
      return response.json();
    }
  }

  const raw = fs.readFileSync(CONTENT_PATH, 'utf-8');

  return JSON.parse(raw);
}

export async function saveContent(newContent) {
  await put(
    CONTENT_FILE,
    JSON.stringify(newContent, null, 2),
    {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    }
  );

  return newContent;
}