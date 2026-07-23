'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiSave, FiExternalLink, FiCheckCircle, FiEye, FiX, FiSmartphone, FiMonitor } from 'react-icons/fi';
import {
  Section,
  TextField,
  ColorField,
  ImageField,
  ListEditor,
  ToggleField,
} from '../../components/admin/Fields';

export default function AdminDashboard() {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [previewReady, setPreviewReady] = useState(false);
  const router = useRouter();
  const iframeRef = useRef(null);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then(setContent);
  }, []);

  // Envia o conteúdo atual para o iframe de preview sempre que algo muda (com pequeno debounce)
  useEffect(() => {
    if (!content || !previewReady) return;
    const timeout = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'HM_PREVIEW_UPDATE', content },
        window.location.origin
      );
    }, 200);
    return () => clearTimeout(timeout);
  }, [content, previewReady]);

  // Escuta o aviso de "estou pronto" vindo do iframe de preview
  useEffect(() => {
    function handleMessage(event) {
      if (event.data?.type === 'HM_PREVIEW_READY') {
        setPreviewReady(true);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  function update(path, value) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      let ref = copy;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return copy;
    });
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      alert('Erro ao salvar. Tente fazer login novamente.');
    }
  }

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  if (!content) {
    return <div className="p-10 text-center text-sm text-[#011923]/50">Carregando conteúdo...</div>;
  }

  return (
    <div>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#011923]/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold">Painel Administrativo</h1>
            <p className="text-xs text-[#011923]/50">HM Soluções Empresariais</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewOpen((v) => !v)}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-[#011923]/15 hover:border-[#B38C41]"
            >
              <FiEye /> {previewOpen ? 'Ocultar preview' : 'Ver preview ao vivo'}
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-[#011923]/15 hover:border-[#B38C41]"
            >
              <FiExternalLink /> Ver site
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-[#B38C41] text-white hover:bg-[#8C6C2F] disabled:opacity-60"
            >
              {saved ? <FiCheckCircle /> : <FiSave />}
              {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar alterações'}
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg text-[#011923]/60 hover:text-red-600"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <main
          className={`flex-1 min-w-0 px-6 py-10 transition-all duration-300 ${
            previewOpen ? 'xl:mr-[420px]' : ''
          }`}
        >
          <div className="max-w-3xl mx-auto">
        <Section
          title="Introdução (parallax em tela cheia)"
          description="Tela cheia que aparece antes do site, revelando frases de impacto conforme o visitante rola a página. Pode ser desligada se preferir ir direto para o site."
        >
          <ToggleField
            label="Ativar introdução"
            description="Se desligado, o site abre direto na navbar/hero"
            checked={content.intro.enabled}
            onChange={(v) => update(['intro', 'enabled'], v)}
          />
          <div>
            <span className="block text-sm font-medium mb-2">Frases (aparecem uma por vez)</span>
            <ListEditor
              items={content.intro.phrases}
              onChange={(v) => update(['intro', 'phrases'], v)}
              addLabel="Adicionar frase"
              newItem={() => 'Nova frase de impacto'}
              renderItem={(item, onUpdate) => (
                <TextField label="Frase" value={item} onChange={(v) => onUpdate(v)} textarea />
              )}
            />
          </div>
        </Section>

        <Section title="Tema (Cores)" description="Cores principais usadas em toda a landing page">
          <div className="grid sm:grid-cols-2 gap-4">
            <ColorField
              label="Cor primária (dourado)"
              value={content.theme.primary}
              onChange={(v) => update(['theme', 'primary'], v)}
            />
            <ColorField
              label="Cor secundária (azul-marinho)"
              value={content.theme.secondary}
              onChange={(v) => update(['theme', 'secondary'], v)}
            />
          </div>
        </Section>

        <Section title="Barra de navegação">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Nome / Logo (texto)"
              value={content.navbar.logoText}
              onChange={(v) => update(['navbar', 'logoText'], v)}
            />
            <TextField
              label="Selo ao lado do logo"
              value={content.navbar.logoBadge}
              onChange={(v) => update(['navbar', 'logoBadge'], v)}
            />
            <TextField
              label="Texto do botão CTA"
              value={content.navbar.ctaText}
              onChange={(v) => update(['navbar', 'ctaText'], v)}
            />
            <TextField
              label="Número de WhatsApp (com DDI/DDD)"
              value={content.navbar.whatsappNumber}
              onChange={(v) => update(['navbar', 'whatsappNumber'], v)}
            />
          </div>
        </Section>

        <Section title="Seção Hero (topo da página)">
          <TextField
            label="Chamada pequena (eyebrow)"
            value={content.hero.eyebrow}
            onChange={(v) => update(['hero', 'eyebrow'], v)}
          />
          <TextField
            label="Título principal"
            value={content.hero.title}
            onChange={(v) => update(['hero', 'title'], v)}
            textarea
          />
          <TextField
            label="Palavra do título em destaque (deve existir dentro do título)"
            value={content.hero.highlight}
            onChange={(v) => update(['hero', 'highlight'], v)}
          />
          <TextField
            label="Subtítulo"
            value={content.hero.subtitle}
            onChange={(v) => update(['hero', 'subtitle'], v)}
            textarea
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Texto botão principal"
              value={content.hero.ctaPrimaryText}
              onChange={(v) => update(['hero', 'ctaPrimaryText'], v)}
            />
            <TextField
              label="Texto botão secundário"
              value={content.hero.ctaSecondaryText}
              onChange={(v) => update(['hero', 'ctaSecondaryText'], v)}
            />
          </div>
          <div>
            <span className="block text-sm font-medium mb-2">Estatísticas do Hero</span>
            <ListEditor
              items={content.hero.stats}
              onChange={(v) => update(['hero', 'stats'], v)}
              newItem={() => ({ label: 'Novo indicador', value: '0' })}
              addLabel="Adicionar estatística"
              renderItem={(item, onUpdate) => (
                <div className="grid sm:grid-cols-2 gap-3">
                  <TextField
                    label="Valor"
                    value={item.value}
                    onChange={(v) => onUpdate({ ...item, value: v })}
                  />
                  <TextField
                    label="Rótulo"
                    value={item.label}
                    onChange={(v) => onUpdate({ ...item, label: v })}
                  />
                </div>
              )}
            />
          </div>
        </Section>

        <Section title="Seção Sobre (fundador)">
          <TextField
            label="Tag pequena"
            value={content.about.tag}
            onChange={(v) => update(['about', 'tag'], v)}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Nome"
              value={content.about.name}
              onChange={(v) => update(['about', 'name'], v)}
            />
            <TextField
              label="Cargo / função"
              value={content.about.role}
              onChange={(v) => update(['about', 'role'], v)}
            />
          </div>
          <TextField
            label="Selo (badge)"
            value={content.about.badge}
            onChange={(v) => update(['about', 'badge'], v)}
          />
          <ImageField
            label="Foto"
            value={content.about.photo}
            onChange={(v) => update(['about', 'photo'], v)}
          />
          <TextField
            label="Biografia"
            value={content.about.bio}
            onChange={(v) => update(['about', 'bio'], v)}
            textarea
          />
          <div>
            <span className="block text-sm font-medium mb-2">Estatísticas</span>
            <ListEditor
              items={content.about.stats}
              onChange={(v) => update(['about', 'stats'], v)}
              newItem={() => ({ label: 'Novo indicador', value: '0' })}
              addLabel="Adicionar estatística"
              renderItem={(item, onUpdate) => (
                <div className="grid sm:grid-cols-2 gap-3">
                  <TextField
                    label="Valor"
                    value={item.value}
                    onChange={(v) => onUpdate({ ...item, value: v })}
                  />
                  <TextField
                    label="Rótulo"
                    value={item.label}
                    onChange={(v) => onUpdate({ ...item, label: v })}
                  />
                </div>
              )}
            />
          </div>
        </Section>

        <Section
          title="Serviços prestados"
          description="Seção com efeito parallax mostrando as categorias de serviço (Consultoria, MEI, Pessoa Física, Empresas, etc.)"
        >
          <TextField
            label="Chamada pequena (eyebrow)"
            value={content.services.eyebrow}
            onChange={(v) => update(['services', 'eyebrow'], v)}
          />
          <TextField
            label="Título da seção"
            value={content.services.title}
            onChange={(v) => update(['services', 'title'], v)}
          />
          <TextField
            label="Subtítulo"
            value={content.services.subtitle}
            onChange={(v) => update(['services', 'subtitle'], v)}
            textarea
          />
          <div>
            <span className="block text-sm font-medium mb-2">Categorias de serviço</span>
            <ListEditor
              items={content.services.categories}
              onChange={(v) => update(['services', 'categories'], v)}
              addLabel="Adicionar categoria"
              newItem={() => ({ title: 'Nova categoria', items: ['Novo serviço'] })}
              renderItem={(item, onUpdate) => (
                <>
                  <TextField
                    label="Nome da categoria"
                    value={item.title}
                    onChange={(v) => onUpdate({ ...item, title: v })}
                  />
                  <TextField
                    label="Serviços (um por linha)"
                    value={item.items.join('\n')}
                    onChange={(v) => onUpdate({ ...item, items: v.split('\n') })}
                    textarea
                  />
                </>
              )}
            />
          </div>
        </Section>

        <Section title="Depoimentos de clientes">
          <ListEditor
            items={content.testimonials}
            onChange={(v) => update(['testimonials'], v)}
            addLabel="Adicionar depoimento"
            newItem={() => ({
              name: 'Nome do cliente',
              role: 'Cargo - Empresa',
              photo: '/uploads/avatar-placeholder-1.svg',
              rating: 5,
              text: 'Depoimento do cliente...',
            })}
            renderItem={(item, onUpdate) => (
              <>
                <div className="grid sm:grid-cols-2 gap-3">
                  <TextField
                    label="Nome"
                    value={item.name}
                    onChange={(v) => onUpdate({ ...item, name: v })}
                  />
                  <TextField
                    label="Cargo / Empresa"
                    value={item.role}
                    onChange={(v) => onUpdate({ ...item, role: v })}
                  />
                </div>
                <ImageField
                  label="Foto"
                  value={item.photo}
                  onChange={(v) => onUpdate({ ...item, photo: v })}
                />
                <TextField
                  label="Nota (1 a 5)"
                  type="number"
                  value={item.rating}
                  onChange={(v) => onUpdate({ ...item, rating: Number(v) })}
                />
                <TextField
                  label="Depoimento"
                  value={item.text}
                  onChange={(v) => onUpdate({ ...item, text: v })}
                  textarea
                />
              </>
            )}
          />
        </Section>

        <Section
          title="Gráfico de Área — Crescimento de receita"
          description="Cada ponto representa um mês e o valor de receita"
        >
          <ListEditor
            items={content.charts.area}
            onChange={(v) => update(['charts', 'area'], v)}
            addLabel="Adicionar ponto"
            newItem={() => ({ name: 'Mês', receita: 0 })}
            renderItem={(item, onUpdate) => (
              <div className="grid sm:grid-cols-2 gap-3">
                <TextField
                  label="Nome (mês)"
                  value={item.name}
                  onChange={(v) => onUpdate({ ...item, name: v })}
                />
                <TextField
                  label="Receita"
                  type="number"
                  value={item.receita}
                  onChange={(v) => onUpdate({ ...item, receita: Number(v) })}
                />
              </div>
            )}
          />
        </Section>

        <Section title="Gráfico de Barras — Impacto por área">
          <ListEditor
            items={content.charts.bar}
            onChange={(v) => update(['charts', 'bar'], v)}
            addLabel="Adicionar barra"
            newItem={() => ({ name: 'Área', impacto: 0 })}
            renderItem={(item, onUpdate) => (
              <div className="grid sm:grid-cols-2 gap-3">
                <TextField
                  label="Nome"
                  value={item.name}
                  onChange={(v) => onUpdate({ ...item, name: v })}
                />
                <TextField
                  label="Impacto (0-100)"
                  type="number"
                  value={item.impacto}
                  onChange={(v) => onUpdate({ ...item, impacto: Number(v) })}
                />
              </div>
            )}
          />
        </Section>

        <Section title="Gráfico de Pizza — Áreas de atuação">
          <ListEditor
            items={content.charts.pie}
            onChange={(v) => update(['charts', 'pie'], v)}
            addLabel="Adicionar fatia"
            newItem={() => ({ name: 'Serviço', value: 0 })}
            renderItem={(item, onUpdate) => (
              <div className="grid sm:grid-cols-2 gap-3">
                <TextField
                  label="Nome do serviço"
                  value={item.name}
                  onChange={(v) => onUpdate({ ...item, name: v })}
                />
                <TextField
                  label="Percentual"
                  type="number"
                  value={item.value}
                  onChange={(v) => onUpdate({ ...item, value: Number(v) })}
                />
              </div>
            )}
          />
        </Section>

        <Section title="Perguntas frequentes (FAQ)">
          <ListEditor
            items={content.faq}
            onChange={(v) => update(['faq'], v)}
            addLabel="Adicionar pergunta"
            newItem={() => ({ question: 'Nova pergunta?', answer: 'Resposta...' })}
            renderItem={(item, onUpdate) => (
              <>
                <TextField
                  label="Pergunta"
                  value={item.question}
                  onChange={(v) => onUpdate({ ...item, question: v })}
                />
                <TextField
                  label="Resposta"
                  value={item.answer}
                  onChange={(v) => onUpdate({ ...item, answer: v })}
                  textarea
                />
              </>
            )}
          />
        </Section>

        <Section title="CTA Final (chamada para WhatsApp)">
          <TextField
            label="Título"
            value={content.ctaFinal.title}
            onChange={(v) => update(['ctaFinal', 'title'], v)}
          />
          <TextField
            label="Subtítulo"
            value={content.ctaFinal.subtitle}
            onChange={(v) => update(['ctaFinal', 'subtitle'], v)}
            textarea
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Texto do botão"
              value={content.ctaFinal.buttonText}
              onChange={(v) => update(['ctaFinal', 'buttonText'], v)}
            />
            <TextField
              label="Número de WhatsApp (com DDI/DDD)"
              value={content.ctaFinal.whatsappNumber}
              onChange={(v) => update(['ctaFinal', 'whatsappNumber'], v)}
            />
          </div>
          <TextField
            label="Mensagem pré-preenchida do WhatsApp"
            value={content.ctaFinal.whatsappMessage}
            onChange={(v) => update(['ctaFinal', 'whatsappMessage'], v)}
            textarea
          />
        </Section>

        <Section title="Rodapé">
          <TextField
            label="Texto do rodapé"
            value={content.footer.text}
            onChange={(v) => update(['footer', 'text'], v)}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Link do Instagram"
              value={content.footer.instagram}
              onChange={(v) => update(['footer', 'instagram'], v)}
            />
            <TextField
              label="E-mail de contato"
              value={content.footer.email}
              onChange={(v) => update(['footer', 'email'], v)}
            />
          </div>
          <TextField
            label="Cidade / Localização"
            value={content.footer.city}
            onChange={(v) => update(['footer', 'city'], v)}
          />
        </Section>

        <div className="flex justify-end pb-16">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#B38C41] text-white font-medium hover:bg-[#8C6C2F] disabled:opacity-60"
          >
            {saved ? <FiCheckCircle /> : <FiSave />}
            {saving ? 'Salvando...' : saved ? 'Alterações salvas!' : 'Salvar alterações'}
          </button>
        </div>
          </div>
        </main>

        {/* Painel de preview ao vivo — mostra exatamente como a landing page fica com as alterações,
            atualizado em tempo real conforme o admin digita, antes mesmo de salvar. */}
        <aside
          className={`fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-[#F5F3EF] border-l border-[#011923]/10 shadow-2xl z-40 flex flex-col transition-transform duration-300 ${
            previewOpen ? 'translate-x-0' : 'translate-x-full'
          } ${previewDevice === 'desktop' ? 'xl:w-[560px]' : ''}`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#011923]/10 bg-white">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FiEye className="text-[#B38C41]" /> Preview ao vivo
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPreviewDevice('mobile')}
                aria-label="Visualizar como mobile"
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  previewDevice === 'mobile' ? 'bg-[#B38C41] text-white' : 'text-[#011923]/50 hover:bg-[#B38C41]/10'
                }`}
              >
                <FiSmartphone size={14} />
              </button>
              <button
                onClick={() => setPreviewDevice('desktop')}
                aria-label="Visualizar como desktop"
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  previewDevice === 'desktop' ? 'bg-[#B38C41] text-white' : 'text-[#011923]/50 hover:bg-[#B38C41]/10'
                }`}
              >
                <FiMonitor size={14} />
              </button>
              <button
                onClick={() => setPreviewOpen(false)}
                aria-label="Fechar preview"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#011923]/50 hover:bg-red-50 hover:text-red-600 ml-1"
              >
                <FiX size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden bg-[#011923]/5 flex justify-center">
            <div
              className="h-full bg-white shadow-inner transition-all duration-300 overflow-hidden"
              style={{ width: previewDevice === 'mobile' ? 390 : '100%' }}
            >
              {!previewReady && (
                <div className="h-full flex items-center justify-center text-xs text-[#011923]/40">
                  Carregando preview...
                </div>
              )}
              <iframe
                ref={iframeRef}
                src="/preview"
                title="Preview ao vivo do site"
                className="w-full h-full border-none"
                style={{ display: previewReady ? 'block' : 'none' }}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
