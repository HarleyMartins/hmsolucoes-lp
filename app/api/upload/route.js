import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, isValidSessionToken } from '../../../lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!token || !(await isValidSessionToken(token))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Arquivo maior que 5MB' }, { status: 400 });
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const extension = file.name.split('.').pop().toLowerCase();
  const fileName = `${randomUUID()}.${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ ok: true, url: `/uploads/${fileName}` });
}
