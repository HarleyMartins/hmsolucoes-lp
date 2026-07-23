export const metadata = {
  title: 'Painel Admin | HM Soluções',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-[#F5F3EF] text-secondary font-sans"
      style={{ colorScheme: 'light' }}
    >
      {children}
    </div>
  );
}
