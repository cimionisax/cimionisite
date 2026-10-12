import React from 'react'
import { motion } from 'framer-motion'
import { Music2, Sparkles, Instagram, Youtube, Phone, Mail, Calendar, MessageSquareMore, CheckCircle2, ArrowRight } from 'lucide-react'

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
  email: 'cimioi_saxmusic@outlook.com',
  instagram: 'https://www.instagram.com/_cimionimateus',
  youtube: 'https://www.youtube.com/@CimioniMateus',
}

// vídeos com os títulos pedidos (mantendo URLs completas)
const instaVideos = [
  { title: 'Receptivo ao vivo',                url: 'https://www.instagram.com/reel/DA1xdzxvcC-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { title: 'Feel So Close e a vibe da pista!', url: 'https://www.instagram.com/reel/Cz1yN6GPMhC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { title: 'This Girl ao vivo em casamento!',  url: 'https://www.instagram.com/reel/C9n4-vWv00j/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
]

// helper: extrai o shortcode do Reel a partir da URL
const igCode = (url) => url.match(/\/(?:reel|p)\/([^/?#]+)/)?.[1] || ""

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function App() {
  const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Olá, ${SITE.name}! Gostaria de verificar disponibilidade e valores do seu show de DJ & Sax.`
  )}`

  return (
    <div className="relative min-h-screen text-[color:var(--light)]"
      style={{ ['--light']: BRAND.light }}>
      {/* Camada de fundo fixa para o site todo */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/bg-cimioni.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 10%', // ajuste fino do enquadramento
            backgroundAttachment: 'fixed'
          }}
        />
        {/* overlay para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* logo pequena à esquerda (opcional) */}
          <a href="#home" className="shrink-0">
            <img src="/images/logo-light.png" alt="Logo" className="h-10" />
          </a>

          {/* botão compacto à direita */}
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl px-4 py-2 inline-flex items-center gap-2"
            style={{ backgroundColor: BRAND.accent }}
          >
            <Phone className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </nav>

      {/* HERO com BG + logo grande + selo */}
      <section id="home" className="relative max-w-6xl mx-auto px-4 pt-20 pb-14">
        {/* BG só do HERO */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/bg-cimioni.jpg')", // <- sua foto do topo
              backgroundSize: 'cover',
              backgroundPosition: 'center 18%',
            }}
          />
          {/* overlay mais forte pra garantir leitura */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/65" />
        </div>

        {/* LOGO central (um pouco menor) */}
        <header className="relative z-10 pt-6">
          <div className="max-w-6xl mx-auto px-4 flex justify-center">
            <img
              src="/images/logo-light.png"
              alt="Cimioni Mateus — Saxmusic"
              className="h-20 md:h-28 lg:h-32 drop-shadow-[0_10px_35px_rgba(0,0,0,0.55)]"
            />
          </div>
        </header>

        {/* CONTEÚDO do hero — reforcei z-index */}
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Vibração &amp; Sofisticação em <span className="text-[color:#EC6E1A]">DJ &amp; Sax</span>
          </h1>
          <p className="mt-4 text-zinc-200">
            Performances ao vivo para casamentos, formaturas e eventos corporativos em todo o Brasil.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl px-6 py-3 inline-flex items-center gap-2"
              style={{ backgroundColor: '#EC6E1A' }}
            >
              Verificar disponibilidade
            </a>
            <a
              href="#musicas"
              className="rounded-2xl px-6 py-3 border border-white/10 hover:bg-white/5 inline-flex items-center gap-2"
            >
              Ouvir um pouco
            </a>
          </div>
        </div>
      </section>

      {/* Experiências: DJ e Sax */}
      <section id="servicos" className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-9">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5" style={{color:BRAND.accent}} />
            <span className="text-xs uppercase tracking-[.2em] text-zinc-300">Experiências musicais</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">A trilha certa para cada momento.</h2>
          <p className="mt-3 max-w-3xl text-zinc-300">Da atmosfera elegante ao auge da pista: contrate DJ, sax ao vivo ou combine as duas experiências em uma proposta personalizada.</p>
        </div>
        {[
          {heading:'DJ',eyebrow:'Curadoria e pista',description:'Uma experiência conduzida com identidade musical, leitura de público e repertório pensado para o seu evento.',items:[
            {title:'DJ Residente do Evento',tag:'Do início ao fim',description:'A condução musical do evento, com curadoria para seus diferentes momentos.',bullets:['Planejamento do repertório e briefing musical','Ambientação, transições e condução da pista','Adaptação da energia à programação e ao público'],cta:'Consultar DJ residente'},
            {title:'DJ Atração',tag:'Performance especial',description:'Um set de destaque, pensado como atração para um momento marcante da festa.',bullets:['Apresentação em horário definido','Identidade e proposta musical do set','Integração com a produção e a programação'],cta:'Consultar DJ atração'}
          ]},
          {heading:'Sax Live',eyebrow:'Música ao vivo',description:'O saxofone como protagonista de uma experiência elegante ou de um momento de alta energia.',items:[
            {title:'Sax Receptivo',tag:'Atmosfera',description:'Performance ao vivo para receber os convidados e valorizar a ambientação.',bullets:['Repertório adequado ao conceito do evento','Performance para receptivo ou coquetel','Formato alinhado à duração e ao espaço'],cta:'Consultar sax receptivo'},
            {title:'Sax Pista',tag:'Impacto',description:'Uma entrada de sax ao vivo para transformar a energia da pista.',bullets:['Performance de destaque na pista','Interação com a música e o público','Momento combinado com o DJ e a produção'],cta:'Consultar sax pista'}
          ]}
        ].map(group=>(
          <div key={group.heading} className="mb-12">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/15 pb-4">
              <div><p className="text-xs uppercase tracking-widest" style={{color:BRAND.accent}}>{group.eyebrow}</p><h3 className="mt-1 text-2xl md:text-3xl font-bold">{group.heading}</h3></div>
              <p className="max-w-lg text-sm text-zinc-300">{group.description}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {group.items.map((p,i)=>(
                <motion.article key={p.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{once:true}} transition={{delay:i*.08}}
                  className="flex flex-col rounded-2xl border border-white/15 bg-zinc-950/90 p-6">
                  <span className="self-start rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">{p.tag}</span>
                  <h4 className="mt-4 text-xl font-semibold">{p.title}</h4>
                  <p className="mt-2 text-sm text-zinc-300">{p.description}</p>
                  <ul className="mt-5 flex-1 space-y-3 text-sm text-zinc-300">
                    {p.bullets.map(b=><li key={b} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{color:BRAND.accent}}/><span>{b}</span></li>)}
                  </ul>
                  <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de receber informações e disponibilidade para '+p.title+'.')}`}
                    target="_blank" rel="noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white"
                    style={{backgroundColor:BRAND.accent}}>
                    {p.cta}<ArrowRight className="h-4 w-4"/>
                  </a>
                </motion.article>
              ))}
            </div>
          </div>
        ))}
        <div className="rounded-2xl border border-orange-500/30 bg-white/5 p-6 md:flex md:items-center md:justify-between md:gap-6">
          <div><h3 className="text-xl font-bold">DJ + Sax Live</h3><p className="mt-2 text-sm text-zinc-300">O melhor dos dois universos em uma experiência integrada, desenhada para o seu evento.</p></div>
          <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de uma proposta personalizada de DJ + Sax Live.')}`}
            target="_blank" rel="noreferrer"
            className="mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-white md:mt-0"
            style={{backgroundColor:BRAND.accent}}>Solicitar proposta<ArrowRight className="h-4 w-4"/></a>
        </div>
      </section>

      {/* Músicas — agora com EMBED do Instagram */}
      <section id='musicas' className='max-w-6xl mx-auto px-4 py-16'>
        <div className='flex items-center gap-2 mb-6'>
          <Music2 className='w-5 h-5' />
          <h2 className='text-2xl md:text-3xl font-bold'>Ouça um pouco</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {instaVideos.map((v) => (
            <article key={v.title} className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black/40">
              <div className="aspect-video">
                <iframe
                  title={v.title}
                  src={`https://www.instagram.com/reel/${igCode(v.url)}/embed`}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <div className="p-4 text-sm text-zinc-300 flex items-center gap-2">
                <Instagram className="w-4 h-4" /> {v.title}
              </div>
            </article>
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
