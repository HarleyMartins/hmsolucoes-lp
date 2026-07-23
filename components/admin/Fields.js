'use client';

import { useState } from 'react';
import { FiTrash2, FiPlus, FiUploadCloud } from 'react-icons/fi';

export function ToggleField({ label, description, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && <span className="block text-xs text-[#011923]/50 mt-0.5">{description}</span>}
      </span>
      <span
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-[#B38C41]' : 'bg-[#011923]/20'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
    </label>
  );
}

export function Section({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl border border-[#011923]/10 p-6 mb-6">
      <h2 className="font-semibold text-lg mb-1">{title}</h2>
      {description && <p className="text-sm text-[#011923]/50 mb-5">{description}</p>}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export function TextField({ label, value, onChange, textarea = false, type = 'text' }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-[#011923]/15 bg-white text-[#011923] px-3 py-2 text-sm focus:outline-none focus:border-[#B38C41]"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-[#011923]/15 bg-white text-[#011923] px-3 py-2 text-sm focus:outline-none focus:border-[#B38C41]"
        />
      )}
    </label>
  );
}

export function ColorField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-lg border border-[#011923]/15 bg-white cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-[#011923]/15 bg-white text-[#011923] px-3 py-2 text-sm focus:outline-none focus:border-[#B38C41]"
        />
      </div>
    </label>
  );
}

export function ImageField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    setUploading(false);

    if (res.ok) {
      onChange(json.url);
    } else {
      alert(json.error || 'Erro ao enviar imagem');
    }
  }

  return (
    <div>
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <div className="flex items-center gap-4">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label}
            className="w-16 h-16 rounded-lg object-cover border border-[#011923]/10"
          />
        )}
        <label className="inline-flex items-center gap-2 text-sm rounded-lg border border-dashed border-[#B38C41]/50 bg-white text-[#011923] px-4 py-2 cursor-pointer hover:bg-[#B38C41]/5">
          <FiUploadCloud />
          {uploading ? 'Enviando...' : 'Trocar imagem'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>
    </div>
  );
}

export function ListEditor({ items, onChange, renderItem, newItem, addLabel = 'Adicionar item' }) {
  function updateItem(index, updated) {
    const copy = [...items];
    copy[index] = updated;
    onChange(copy);
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, typeof newItem === 'function' ? newItem() : newItem]);
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="relative rounded-xl border border-[#011923]/10 p-4 bg-[#F5F3EF]/50"
        >
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
            aria-label="Remover"
          >
            <FiTrash2 size={16} />
          </button>
          <div className="grid gap-3 pr-8">
            {renderItem(item, (updated) => updateItem(index, updated), index)}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-2 self-start text-sm text-[#B38C41] font-medium hover:underline"
      >
        <FiPlus /> {addLabel}
      </button>
    </div>
  );
}
