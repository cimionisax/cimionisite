import React from 'react'
import { motion } from 'framer-motion'
import { Music2, Sparkles, Instagram, Youtube, Phone, Mail, Calendar, MessageSquareMore, CheckCircle2, PlayCircle, ArrowRight } from 'lucide-react'

// Paleta da marca
const BRAND = {
  bg1: '#04181B',
  bg2: '#062125',
  light: '#EDEEE6',
  accent: '#EC6E1A',
}

const SITE = {
  name: 'Cimioni Mateus',
  tagline: 'DJ & Sax Live',
  city: 'Brasil',
  whatsapp: '5551998926490',
  email: 'contato@seusite.com',
  instagram: 'https://www.instagram.com/_cimionimateus',
  youtube: 'https://youtube.com/@seucanal',
}

const packages = [
  {
    title: 'Walking Sax & Live Sax',
    bullets: [
      'Receptivo elegante (até 1h)',
      'Entrada impactante na pista (até 1h)',
      'Repertório Deep/Chill/House/Open',
      'Look especial para a pista',
    ],
    cta: 'Quero esse',
  },
  {
    title: 'Full Event (Premium)',
    highlight: true,
    bullets: [
      'Presença do início ao fim',
      'Participação na cerimônia, no Receptivo, no Coquetel e na pista!',
      'Única venda com acréscimo de cerimônia',
      'Receptivo + Pista personalizáveis',
    ],
    cta: 'Reservar data',
  },
  {
    title: 'Corporate & Specials',
    bullets: [
      'Eventos corporativos e lançamentos',
      'Ambiente lounge sofisticado',
      'Versão pista com alto impacto',
      'Rider técnico sob demanda',
    ],
    cta: 'Conversar',
  },
]

const instaVideos = [
  { title: 'Live Sax na pista', url: 'https://www.instagram.com/reel/DA1xdzxvcC-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { title: 'Afro/Deep House drop', url: 'https://www.instagram.com/reel/Cz1yN6GPMhC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { title: 'Casamento – entrada', url: 'https://www.instagram.com/reel/C9n4-vWv00j/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function App() {
  const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Olá, ${SITE.name}! Gostaria de verificar disponibilidade e valores do seu show de DJ & Sax.`
  )}`

  return (
    <div
      className='min-h-screen w-full text-[color:var(--light)]'
      style={{
        background: `radial-gradient(1200px 600px at 50% -10%, rgba(236,110,26,0.15), transparent 60%), linear-gradient(${BRAND.bg1}, ${BRAND.bg2})`,
        ['--light']: BRAND.light,
      }}
    >
      {/* NAVBAR */}
      <nav className='sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/10'>
        <div className='max-w-6xl mx-auto flex items-center justify-between px-4 py-3'>
          <a href='#home' className='flex items-center gap-3 font-semibold tracking-wider text-lg'>
            <img src='/images/logo-light.png' alt='Logo' className='h-10' />
          </a>
          <a
            href={waLink}
            target='_blank'
            rel='noreferrer'
            className='rounded-2xl px-4 py-2 inline-flex items-center gap-2'
            style={{ backgroundColor: BRAND.accent }}
          >
            <Phone className='w-4 h-4' /> WhatsApp
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id='home' className='max-w-6xl mx-auto px-4 py-20 text-center'>
        <motion.h1 variants={fadeUp} initial='hidden' whileInView='show' viewport={{ once: true }} className='text-4xl md:text-6xl font-extrabold tracking-tight'>
          Vibração & Sofisticação em <span style={{ color: BRAND.accent }}>DJ & Sax</span>
        </motion.h1>
        <motion.p variants={fadeUp} initial='hidden' whileInView='show' viewport={{ once: true }} className='mt-4 text-zinc-300'>
          Performances ao vivo para casamentos, formaturas e eventos corporativos em todo o {SITE.city}.
        </motion.p>
        <div className='mt-8 flex items-center justify-center gap-3'>
          <a href={waLink} target='_blank' rel='noreferrer' className='rounded-2xl px-6 py-3 inline-flex items-center gap-2' style={{ backgroundColor: BRAND.accent }}>
            <Calendar className='w-4 h-4' /> Verificar disponibilidade
          </a>
          <a href='#musicas' className='rounded-2xl px-6 py-3 border border-white/10 hover:bg-white/5 inline-flex items-center gap-2'>
            <Music2 className='w-4 h-4' /> Ouvir um pouco
          </a>
        </div>
        <div className='mt-8 flex items-center justify-center gap-4 text-zinc-400'>
          <a className='hover:text-white inline-flex items-center gap-2' href={SITE.instagram} target='_blank' rel='noreferrer'><Instagram className='w-5 h-5' />Instagram</a>
          <a className='hover:text-white inline-flex items-center gap-2' href={SITE.youtube} target='_blank' rel='noreferrer'><Youtube className='w-5 h-5' />YouTube</a>
          <a className='hover:text-white inline-flex items-center gap-2' href={`mailto:${SITE.email}`}><Mail className='w-5 h-5' />E-mail</a>
        </div>
      </section>

      {/* Serviços */}
      <section id='servicos' className='max-w-6xl mx-auto px-4 py-16'>
        <div className='flex items-center gap-2 mb-6'>
          <Sparkles className='w-5 h-5' style={{ color: BRAND.accent }} />
          <h2 className='text-2xl md:text-3xl font-bold'>Pacotes</h2>
        </div>
        <div className='grid md:grid-cols-3 gap-6'>
          {packages.map((p, i) => (
            <motion.div key={p.title} variants={fadeUp} initial='hidden' whileInView='show' viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <div className={`rounded-2xl border border-white/10 p-6 ${p.highlight ? 'bg-white/5' : 'bg-zinc-950'}`}>
                <div className='text-lg md:text-xl font-semibold flex items-center justify-between'>
                  {p.title}
                  {p.highlight && (
                    <span className='text-xs px-2 py-1 rounded-full' style={{ background: 'rgba(236,110,26,0.12)', color: '#F4C3A1', border: '1px solid rgba(236,110,26,0.35)' }}>Mais pedido</span>
                  )}
                </div>
                <ul className='mt-4 space-y-2 text-zinc-300'>
                  {p.bullets.map((b) => (
                    <li key={b} className='flex items-start gap-2'><CheckCircle2 className='w-4 h-4' style={{ color: BRAND.accent }} /> <span>{b}</span></li>
                  ))}
                </ul>
                <a href={waLink} target='_blank' rel='noreferrer' className='mt-4 inline-flex items-center justify-center w-full gap-2 rounded-xl px-4 py-2' style={{ backgroundColor: BRAND.accent }}>
                  {p.cta} <ArrowRight className='w-4 h-4' />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Músicas */}
      <section id='musicas' className='max-w-6xl mx-auto px-4 py-16'>
        <div className='flex items-center gap-2 mb-6'>
          <Music2 className='w-5 h-5' />
          <h2 className='text-2xl md:text-3xl font-bold'>Ouça um pouco</h2>
        </div>
        <div className='grid md:grid-cols-3 gap-6'>
          {instaVideos.map((v) => (
            <a key={v.title} href={v.url} target='_blank' rel='noreferrer' className='group rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-br from-zinc-900 to-black'>
              <div className='aspect-video relative flex items-center justify-center'>
                <PlayCircle className='w-14 h-14 opacity-80 group-hover:scale-105 transition' />
              </div>
              <div className='p-4 text-sm text-zinc-300 flex items-center gap-2'><Instagram className='w-4 h-4' /> {v.title}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Galeria */}
      <section id='galeria' className='max-w-6xl mx-auto px-4 py-16'>
        <h2 className='text-2xl md:text-3xl font-bold mb-6'>Galeria</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          {['/images/C-3.jpg','/images/C-125.jpg','/images/C-126.jpg','/images/C-133.jpg','/images/C-138.jpg','/images/C-146.jpg','/images/C-165.jpg','/images/C-181.jpg'].map((src, i) => (
            <div key={i} className='rounded-xl overflow-hidden border border-white/10 bg-zinc-950 aspect-[4/5]'>
              <img src={src} alt={`Foto ${i+1}`} className='w-full h-full object-cover' />
            </div>
          ))}
        </div>
      </section>

      {/* Contato */}
      <section id='contato' className='max-w-3xl mx-auto px-4 py-16'>
        <h2 className='text-2xl md:text-3xl font-bold mb-6'>Vamos conversar?</h2>
        <p className='text-zinc-300 mb-6'>Data, cidade, perfil dos convidados e clima desejado. Respondo rapidinho!</p>
        <div className='grid md:grid-cols-3 gap-4'>
          <a href={waLink} target='_blank' rel='noreferrer' className='rounded-2xl border border-white/10 bg-zinc-950 p-5 hover:border-white/20 transition'>
            <div className='font-semibold flex items-center gap-2'><MessageSquareMore className='w-5 h-5' /> WhatsApp</div>
            <div className='text-sm text-zinc-400'>Atendimento direto</div>
          </a>
          <a href={`mailto:${SITE.email}`} className='rounded-2xl border border-white/10 bg-zinc-950 p-5 hover:border-white/20 transition'>
            <div className='font-semibold flex items-center gap-2'><Mail className='w-5 h-5' /> E-mail</div>
            <div className='text-sm text-zinc-400'>{SITE.email}</div>
          </a>
          <a href={SITE.instagram} target='_blank' rel='noreferrer' className='rounded-2xl border border-white/10 bg-zinc-950 p-5 hover:border-white/20 transition'>
            <div className='font-semibold flex items-center gap-2'><Instagram className='w-5 h-5' /> Instagram</div>
            <div className='text-sm text-zinc-400'>@_cimionimateus</div>
          </a>
        </div>
      </section>

      {/* Rodapé */}
      <footer className='border-t border-white/10 py-10 text-center text-sm text-zinc-500'>
        <div className='flex flex-col items-center gap-4'>
          <img src='/images/seal-light.png' alt='Selo' className='h-12' />
          <div>© {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.</div>
        </div>
      </footer>
    </div>
  )
}
