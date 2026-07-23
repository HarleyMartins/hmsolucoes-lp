'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-[#B38C41]/20 p-8"
      >
        <h1 className="font-semibold text-2xl mb-1 text-[#011923]">Painel Admin</h1>
        <p className="text-sm text-[#011923]/60 mb-6">HM Soluções Empresariais</p>

        <label className="block text-sm font-medium mb-2">Senha de acesso</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-[#011923]/20 bg-white text-[#011923] px-4 py-2.5 mb-2 focus:outline-none focus:border-[#B38C41]"
          placeholder="••••••••"
          required
        />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 rounded-lg bg-[#B38C41] text-white font-medium py-2.5 hover:bg-[#8C6C2F] transition-colors disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
