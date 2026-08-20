import './globals.css';
import ThemeProvider from '../components/ThemeProvider';
import { getContent } from '../lib/content';
import { buildThemeVars } from '../lib/color';

export const metadata = {
  title: 'HM Soluções Empresariais | Assessoria e Consultoria',
  description:
    'Consultoria e assessoria empresarial para empresas que querem crescer com estrutura, estratégia e previsibilidade.',
};

export default function RootLayout({ children }) {
  const content = await getContent();
  const themeVars = buildThemeVars(content.theme.primary, content.theme.secondary);
  const cssVars = Object.entries(themeVars)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`:root { ${cssVars} }`}</style>
      </head>
      <body className="font-sans bg-white text-secondary dark:bg-secondary dark:text-white transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
