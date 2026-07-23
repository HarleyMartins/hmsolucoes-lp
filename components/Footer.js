import { FiInstagram, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer({ data }) {
  return (
    <footer className="py-10 border-t border-secondary/10 dark:border-white/10">
      <div className="section-container flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-secondary/60 dark:text-white/60">
        <p>{data.text}</p>
        <div className="flex items-center gap-6">
          <a
            href={data.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <FiInstagram /> Instagram
          </a>
          <a
            href={`mailto:${data.email}`}
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <FiMail /> {data.email}
          </a>
          <span className="hidden sm:flex items-center gap-2">
            <FiMapPin /> {data.city}
          </span>
        </div>
      </div>
      <p className="text-center text-xs text-secondary/40 dark:text-white/30 mt-6">
        © {new Date().getFullYear()} {data.text}. Todos os direitos reservados.
      </p>
    </footer>
  );
}
