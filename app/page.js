import { getContent } from '../lib/content';
import Navbar from '../components/Navbar';
import IntroSequence from '../components/IntroSequence';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/ServicesParallax';
import Testimonials from '../components/Testimonials';
import ChartsSection from '../components/ChartsSection';
import FAQ from '../components/FAQ';
import CTAFinal from '../components/CTAFinal';
import Footer from '../components/Footer';
import WhatsAppFloatButton from '../components/WhatsAppFloatButton';

export default async function Home() {
  const content = await getContent();

  return (
    // IMPORTANTE: overflow-x-hidden NÃO pode ficar no mesmo elemento que envolve a
    // IntroSequence, porque overflow-x != visible força overflow-y para "auto" e isso
    // quebra o position:sticky usado no efeito de parallax pinado. Por isso ele fica
    // isolado num wrapper interno, só em volta do restante do conteúdo.
    <main>
      {content.intro?.enabled && <IntroSequence data={content.intro} />}
      <div className="overflow-x-hidden">
        <Navbar data={content.navbar} />
        <Hero data={content.hero} />
        <About data={content.about} />
        <Services data={content.services} />
        <Testimonials data={content.testimonials} />
        <ChartsSection data={content.charts} />
        <FAQ data={content.faq} />
        <CTAFinal data={content.ctaFinal} />
        <Footer data={content.footer} />
        <WhatsAppFloatButton number={content.ctaFinal.whatsappNumber} />
      </div>
    </main>
  );
}
