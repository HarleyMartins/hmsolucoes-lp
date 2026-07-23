import fs from 'fs';
import path from 'path';

const CONTENT_PATH = path.join(process.cwd(), 'data', 'content.json');

// Lê o conteúdo do site direto do disco (sempre atualizado, sem cache)
export function getContent() {
  const raw = fs.readFileSync(CONTENT_PATH, 'utf-8');
  return JSON.parse(raw);
}

// Sobrescreve o conteúdo do site inteiro (usado pelo painel admin)
export function saveContent(newContent) {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(newContent, null, 2), 'utf-8');
  return newContent;
}
