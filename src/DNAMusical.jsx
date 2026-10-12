import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw, Download, Mail } from 'lucide-react'

const ACCENT = '#EC6E1A'
const types = [
  ['casamento','Casamento','Uma festa que celebra duas histórias.'],
  ['aniversario','Aniversário','Seu jeito de comemorar.'],
  ['formatura','Formatura','Uma conquista merece sua trilha.'],
  ['corporativo','Corporativo','A identidade sonora do seu evento.'],
]
const categories = ['nostalgia','energia','popular','brasil','mistura']
const q = (id,title,options,types=null) => ({id,title,options:options.map(([label,weights])=>({label,weights})),types})
const openQ=(id,title,hint,required=true)=>({id,title,hint,required,kind:'text'})
const genreChoices=[
 ['Pop e dance','Pop / Dance'],['Eletrônica e house','Eletrônica / House'],['Pagode e samba','Pagode / Samba'],
 ['Funk e ritmos urbanos','Funk / Urbano'],['Rock e clássicos','Rock / Clássicos'],['Sertanejo e country','Sertanejo / Country'],
 ['MPB e brasilidades','MPB / Brasilidades'],['Reggaeton e ritmos latinos','Latino / Reggaeton']
]
const genreDetails={
 'Pop / Dance':['Pop de pista e hits atuais','Clássicos pop dos anos 2000/2010','Disco, funk e groove'],
 'Eletrônica / House':['House melódico e orgânico','Afro House / Deep House','EDM e grandes hits eletrônicos'],
 'Pagode / Samba':['Pagode romântico','Pagode de festa e samba','Clássicos de roda'],
 'Funk / Urbano':['Funk comercial leve','Funk de pista mais intenso','Hip-hop e urban pop'],
 'Rock / Clássicos':['Rock clássico','Pop rock nacional','Rock de alta energia'],
 'Sertanejo / Country':['Sertanejo universitário','Sertanejo clássico','Country internacional'],
 'MPB / Brasilidades':['MPB e groove brasileiro','Axé e carnaval','Forró e ritmos regionais'],
 'Latino / Reggaeton':['Reggaeton contemporâneo','Clássicos latinos','Pop latino e salsa']
}
const repertoireQuestions=[
 openQ('artistas_pessoais','Quais artistas realmente fazem parte do seu gosto pessoal?','Cite até cinco. Podem ser nomes que você ouve em casa, no carro ou no dia a dia.'),
 openQ('faixas_pessoais','Quais músicas representam você, mesmo que não sejam para a festa?','Dê dois ou três exemplos e, se quiser, diga por que são importantes.'),
 q('genero_base','Qual universo musical você mais gostaria de explorar na festa?',genreChoices.map(([label,val])=>[val, val==='MPB / Brasilidades'||val==='Pagode / Samba'?{brasil:2}:val==='Eletrônica / House'||val==='Pop / Dance'?{brasil:-2}:{}])),
 ...Object.entries(genreDetails).map(([genre,options])=>({...q('detalhe_'+genre.replace(/[^a-z]/gi,'_').toLowerCase(),'Dentro desse universo, qual direção combina mais com sua festa?',options.map(label=>[label,{}])),when:a=>a.genero_base===genre})),
 openQ('artistas_festa','Quais artistas você gostaria de ouvir na festa?','Podem ser diferentes dos seus favoritos pessoais.'),
 openQ('faixas_festa','Quais músicas são indispensáveis na festa?','Cite músicas e artistas; se não houver obrigatórias, escreva "Nenhuma".'),
 openQ('restricoes_festa','O que você NÃO quer ouvir na festa?','Artistas, músicas ou estilos. Se não houver restrições, escreva "Nenhuma".'),

]
const common = [
 q('uso_musical','Quando você ouve música no dia a dia e pensa na festa, qual afirmação descreve melhor você?',[
  ['Quero ouvir na festa quase tudo que gosto em casa',{popular:-2}],
  ['Meu gosto pessoal é diferente do que quero na pista',{popular:2}],
  ['Quero equilibrar minhas favoritas com a reação dos convidados',{popular:1}]
 ]),
 q('foco_pista','O que você prefere no momento mais animado?',[
  ['Todo mundo cantando um refrão conhecido',{nostalgia:1,popular:2}],
  ['Todo mundo dançando, mesmo sem cantar',{energia:2,popular:-1}],
  ['Um pouco de cada coisa',{mistura:1}]
 ]),
 q('surpresa','Qual é a sua abertura para músicas menos conhecidas?',[
  ['Adoro descobrir faixas diferentes',{popular:-3,nostalgia:-1}],
  ['Gosto se estiverem bem misturadas com clássicos',{popular:0,mistura:1}],
  ['Prefiro principalmente músicas conhecidas',{popular:3}]
 ]),
 q('lembranca','Qual dessas experiências mais combina com sua relação com a música?',[
  ['Relembrar músicas que marcaram fases da vida',{nostalgia:3}],
  ['Descobrir sons e artistas novos',{nostalgia:-3}],
  ['Cantar sucessos com as pessoas que amo',{nostalgia:1,popular:2}],
  ['Sentir o ritmo e dançar sem parar',{energia:2}]
 ]),
 q('transicoes','Em relação à mistura de estilos na festa...',[
  ['Prefiro blocos mais longos com a mesma atmosfera',{mistura:-3}],
  ['Adoro passar de um estilo para outro',{mistura:3}],
  ['Depende do momento e dos convidados',{mistura:0,popular:1}]
 ]),

]
const specific = {
 casamento:[
  q('casamento_foco','O que vocês priorizam na trilha do casamento?',[
   ['Nossa identidade, mesmo com gostos menos populares',{popular:-3}],
   ['Uma pista que agrade à maioria dos convidados',{popular:3}],
   ['Um equilíbrio entre nosso gosto e a energia dos convidados',{popular:1,mistura:1}]
  ]),

 ],
 aniversario:[
  q('aniversario_memoria','O que mais deveria aparecer na festa?',[
   ['Músicas de infância e adolescência',{nostalgia:3}],
   ['Os sons que escuto atualmente',{nostalgia:-2}],
   ['Os hits que animam meus amigos',{popular:2,energia:1}]
  ])
 ],
 formatura:[
  q('formatura_turma','Qual é a identidade musical da turma?',[
   ['Hits que marcaram nossa trajetória',{nostalgia:2,popular:2}],
   ['Festa intensa e cheia de energia',{energia:3}],
   ['Diversidade: cada grupo gosta de um estilo',{mistura:3}]
  ])
 ],
 corporativo:[
  q('corporativo_objetivo','Qual é a prioridade musical do evento?',[
   ['Networking e boas conversas',{energia:-3,popular:-1}],
   ['Sofisticação e identidade da marca',{popular:-2,mistura:-2}],
   ['Celebração e participação dos convidados',{energia:2,popular:2}]
  ])
 ]
}
function compute(answers, questions) {
 const sums=Object.fromEntries(categories.map(k=>[k,0]))
 const counts=Object.fromEntries(categories.map(k=>[k,0]))
 questions.forEach(item=>{
  const option=item.options?.find(o=>o.label===answers[item.id])
  if (!option) return
  Object.entries(option.weights).forEach(([key,value])=>{sums[key]+=value;counts[key]++})
 })
 return Object.fromEntries(categories.map(key=>[key,Math.round(Math.max(5,Math.min(95,50+(counts[key]?sums[key]*8:0))))]))
}
const labels = {
 nostalgia:['Descoberta','Nostalgia'],
 energia:['Progressiva','Explosiva'],
 popular:['Autoral','Popular'],
 brasil:['Internacional','Brasileira'],
 mistura:['Atmosferas consistentes','Mistura de estilos']
}
function interpret(answers,profile,type) {
 const preferred=answers.genero_base||''
 const sing=answers.foco_pista?.startsWith('Todo mundo cantando') || answers.pista==='Todos cantando juntos'
 const dance=answers.foco_pista?.startsWith('Todo mundo dançando')
 const known=answers.surpresa?.startsWith('Prefiro')
 const niche=answers.surpresa?.startsWith('Adoro')
 const personal=answers.uso_musical?.startsWith('Quero ouvir na festa')
 const distinct=answers.uso_musical?.startsWith('Meu gosto pessoal')
 const collective=profile.popular>=65
 const brazil=['MPB / Brasilidades','Pagode / Samba','Funk / Urbano'].includes(preferred)
 const house=preferred==='Eletrônica / House'
 const eclectic=profile.mistura>=65
 const intense=profile.energia>=65
 const nostalgia=profile.nostalgia>=65
 const archetype = brazil && sing ? 'Brasilidades & Coro Coletivo'
  : house && niche ? 'Curadoria Eletrônica Autoral'
  : collective && intense ? 'Pista Popular de Alta Energia'
  : sing && nostalgia ? 'Clássicos para Cantar Junto'
  : eclectic ? 'Open Format Versátil'
  : !collective && !intense ? 'Atmosfera Sofisticada'
  : intense ? 'Pista Dançante' : 'Equilíbrio Musical'
 const summary = [
  sing?'O canto coletivo aparece como ponto forte.':dance?'A dança e o ritmo prevalecem sobre o canto coletivo.':'Há espaço para alternar momentos cantados e dançantes.',
  collective?'O repertório reconhecível tende a ser importante.':'Há abertura para escolhas menos óbvias.',
  intense?'A expectativa é de picos de energia altos.':'A construção gradual da atmosfera merece atenção.',
  eclectic?'Transições entre gêneros podem ser bem recebidas.':'Blocos com uma atmosfera consistente tendem a funcionar melhor.'
 ].join(' ')
 const prioritize=[
  sing?'Refrões fortes e momentos de canto coletivo':dance?'Groove, ritmo e continuidade dançante':'Alternância planejada entre canto e dança',
  brazil?'Sucessos brasileiros identificados pelo cliente':house?'House e eletrônica com groove':('Explorar o repertório de '+(preferred||'estilos escolhidos')),
  nostalgia?'Músicas ligadas a memórias afetivas':'Espaço para novidades alinhadas ao gosto',
  eclectic?'Misturas dinâmicas e passagens entre gêneros':'Sequências consistentes com transições graduais'
 ]
 const cautions=[
  known?'Não apostar em longos blocos de músicas desconhecidas':niche?'Não confundir abertura para descobertas com aceitação irrestrita':'Validar faixas menos conhecidas durante o briefing',
  distinct?'Separar o que o cliente ouve em casa do que quer na pista':personal?'Proteger faixas identitárias sem perder a leitura dos convidados':'Confirmar o equilíbrio entre preferências pessoais e festa',
  'Conferir músicas obrigatórias e restrições antes de fechar a programação'
 ]
 const freedom=niche?'Ampla, mas condicionada ao contexto':known?'Mais dirigida a músicas reconhecíveis':personal?'Centrada na identidade do cliente':'Moderada, com adaptação à pista'
 const signals=[
  {title:'Reconhecimento',value:collective?'Alto':'Flexível',detail:collective?'Hits familiares ganham prioridade':'Existe margem para descobertas'},
  {title:'Pico de energia',value:intense?'Intenso':'Progressivo',detail:intense?'Planejar clímax fortes':'Construir a energia em etapas'},
  {title:'Canto coletivo',value:sing?'Prioritário':dance?'Secundário':'Equilibrado',detail:sing?'Refrões compartilhados são centrais':dance?'O groove ganha protagonismo':'Alternar formatos'},
  {title:'Mistura de gêneros',value:eclectic?'Alta':'Controlada',detail:eclectic?'Open format e surpresas':'Blocos musicais mais coesos'}
 ]
 return {archetype,summary,prioritize,cautions,freedom,signals,notes:'Interpretação heurística baseada nas respostas, sujeita à validação no briefing.'}
}
function freeText(id,title,answers,setAnswers,placeholder,multiline=false) {
 const props={value:answers[id]||'',onChange:e=>setAnswers(prev=>({...prev,[id]:e.target.value})),placeholder,className:'w-full rounded-xl border border-white/20 bg-white/5 p-4 text-white placeholder:text-white/40 outline-none focus:border-orange-500'}
 return <label className="block space-y-2" key={id}><span className="block text-sm text-zinc-200">{title}</span>{multiline?<textarea {...props} rows={3}/>:<input {...props}/>}</label>
}
export default function DNAMusical() {
 const [type,setType]=useState('')
 const [step,setStep]=useState(0)
 const [answers,setAnswers]=useState({})
 const [finished,setFinished]=useState(false)
 const [error,setError]=useState('')
 const questions=useMemo(()=>[...common,...repertoireQuestions,...(specific[type]||[])].filter(item=>!item.when||item.when(answers)), [type,answers.genero_base])
 const profile=useMemo(()=>compute(answers,questions),[answers,questions])
 const diagnosis=useMemo(()=>interpret(answers,profile,type),[answers,profile,type])
 const chosen=questions[step]
 const category=types.find(t=>t[0]===type)
 const complete=()=>{if(chosen.required!==false && !String(answers[chosen.id]||'').trim()){setError(chosen.kind==='text'?'Preencha esse campo para continuar.':'Escolha uma alternativa para continuar.');return}setError('');if(step===questions.length-1)setFinished(true);else setStep(s=>s+1)}
 const reset=()=>{setType('');setStep(0);setAnswers({});setFinished(false);setError('')}
 const result={version:'3.1',eventType:category?.[1],answers,profile,diagnosis,repertoire:{personalArtists:answers.artistas_pessoais,personalSongs:answers.faixas_pessoais,partyGenre:answers.genero_base,partyArtists:answers.artistas_festa,partySongs:answers.faixas_festa,restrictions:answers.restricoes_festa},generatedAt:new Date().toISOString()}
 const exportJSON=()=>{const blob=new Blob([JSON.stringify(result,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='dna-musical.json';a.click();URL.revokeObjectURL(url)}
 const sendEmail=()=>{const body=encodeURIComponent('DNA Musical — '+category?.[1]+'\n\n'+JSON.stringify(result,null,2));window.location.href='mailto:cimioi_saxmusic@outlook.com?subject=Meu%20DNA%20Musical&body='+body}
 return <main className="relative min-h-screen bg-[#04181B] text-[#EDEEE6]">
  <div className="pointer-events-none fixed inset-0" style={{backgroundImage:"linear-gradient(180deg, rgba(4,24,27,.86), rgba(4,24,27,.90)), url('/images/bg-cimioni.jpg')",backgroundPosition:'center center',backgroundSize:'cover',backgroundRepeat:'no-repeat'}} aria-hidden="true" />
  <div className="relative mx-auto max-w-3xl px-5 py-8 md:py-14">
   <div className="flex items-center justify-between border-b border-white/10 pb-5"><a href="/" className="flex items-center gap-2 text-sm text-white/80 hover:text-white"><ArrowLeft size={17}/> Voltar ao site</a><img src="/images/logo-light.png" alt="Cimioni Mateus" className="h-12 w-auto max-w-[175px] object-contain md:h-16" /></div>
   <AnimatePresence mode="wait">
   {!type?<motion.section key="welcome" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} className="pt-14">
    <p className="text-xs uppercase tracking-[.3em]" style={{color:ACCENT}}>Curadoria musical personalizada</p>
    <h1 className="mt-5 text-4xl font-bold md:text-6xl">Toda festa tem uma história.<br/><span style={{color:ACCENT}}>Qual é a sua?</span></h1>
    <p className="mt-5 max-w-xl text-zinc-300">Responda algumas perguntas e descubra a identidade sonora do seu evento. Não existem respostas certas ou erradas.</p>
    <h2 className="mt-12 mb-4 font-semibold">Qual é o tipo de evento?</h2>
    <div className="grid gap-3 sm:grid-cols-2">{types.map(([id,name,description])=><button type="button" key={id} onClick={()=>setType(id)} className="rounded-2xl border border-white/15 bg-white/5 p-5 text-left transition hover:border-orange-500 hover:bg-white/10"><span className="block text-lg font-semibold">{name}</span><span className="mt-1 block text-sm text-zinc-400">{description}</span></button>)}</div>
   </motion.section>:!finished?<motion.section key={step+'-'+type} initial={{opacity:0,x:15}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-15}} className="pt-12">
    <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-400"><span>{category?.[1]}</span><span>Pergunta {step+1} de {questions.length}</span></div>
    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full transition-all" style={{background:ACCENT,width:((step+1)/questions.length*100)+'%'}}/></div>
    <h1 className="mt-12 text-2xl font-bold md:text-4xl">{chosen.title}</h1>
    <div className="mt-3 text-sm text-zinc-400">{chosen.hint||''}</div>
    <div className="mt-8 space-y-3">{chosen.kind==='text'?<textarea rows={4} aria-label={chosen.title} className="w-full rounded-xl border border-white/20 bg-white/5 p-4 text-white placeholder:text-zinc-500 focus:border-orange-500" placeholder="Escreva aqui suas referências..." value={answers[chosen.id]||''} onChange={e=>{setAnswers(a=>({...a,[chosen.id]:e.target.value}));setError('')}}/>:chosen.options.map(o=><button key={o.label} type="button" onClick={()=>{setAnswers(a=>({...a,[chosen.id]:o.label}));setError('')}} className={'w-full rounded-xl border px-5 py-4 text-left transition '+(answers[chosen.id]===o.label?'border-[#EC6E1A] bg-[#EC6E1A]/15':'border-white/15 bg-white/5 hover:border-white/40')} aria-pressed={answers[chosen.id]===o.label}>{o.label}</button>)}</div>
    {error&&<p role="alert" className="mt-4 text-sm text-orange-300">{error}</p>}
    <div className="mt-10 flex justify-between gap-3"><button className="rounded-xl border border-white/20 px-5 py-3" onClick={()=>step?setStep(s=>s-1):setType('')}>Voltar</button><button className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white" style={{background:ACCENT}} onClick={complete}>{step===questions.length-1?'Ver meu DNA':'Próxima'} <ArrowRight size={18}/></button></div>
   </motion.section>:<motion.section key="result" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="pt-12">
    <p className="text-xs uppercase tracking-[.3em]" style={{color:ACCENT}}>Seu resultado</p><h1 className="mt-3 text-4xl font-bold">Seu DNA Musical</h1><p className="mt-3 text-zinc-300">Um retrato inicial das preferências para a festa — para aprofundarmos juntos na curadoria.</p>
    <div className="mt-7 rounded-2xl border border-[#EC6E1A]/40 bg-[#EC6E1A]/10 p-6">
     <p className="text-xs uppercase tracking-[.2em] text-orange-300">Identidade predominante</p>
     <h2 className="mt-2 text-2xl font-bold md:text-3xl">{diagnosis.archetype}</h2>
     <p className="mt-3 leading-relaxed text-zinc-200">{diagnosis.summary}</p>
    </div>
    <h2 className="mt-10 text-xl font-semibold">Identidade musical x repertório da festa</h2>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-white/15 bg-white/5 p-5"><p className="text-xs uppercase tracking-wide text-zinc-400">Seu universo pessoal</p><p className="mt-2 whitespace-pre-wrap text-sm">{answers.artistas_pessoais}</p><p className="mt-3 whitespace-pre-wrap text-sm text-zinc-300">{answers.faixas_pessoais}</p></div>
      <div className="rounded-xl border border-[#EC6E1A]/40 bg-[#EC6E1A]/10 p-5"><p className="text-xs uppercase tracking-wide text-orange-300">Seu repertório de festa</p><p className="mt-2 font-semibold">{answers.genero_base}</p><p className="mt-2 whitespace-pre-wrap text-sm">{answers.artistas_festa}</p><p className="mt-3 whitespace-pre-wrap text-sm text-zinc-300">{answers.faixas_festa}</p></div>
    </div>
    <div className="mt-4 rounded-xl border border-white/15 bg-white/5 p-5"><p className="font-semibold">Não tocar</p><p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">{answers.restricoes_festa}</p></div>
    <h2 className="mt-10 text-xl font-semibold">Leitura da pista</h2>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">{diagnosis.signals.map(s=><div key={s.title} className="rounded-xl border border-white/15 bg-white/5 p-4"><p className="text-xs uppercase tracking-wider text-zinc-400">{s.title}</p><h3 className="mt-2 text-xl font-semibold text-[#EC6E1A]">{s.value}</h3><p className="mt-1 text-sm text-zinc-300">{s.detail}</p></div>)}</div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2">
     <div className="rounded-xl border border-white/15 bg-white/5 p-5"><h3 className="font-semibold">Priorizar na curadoria</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-200">{diagnosis.prioritize.map(v=><li key={v}>{v}</li>)}</ul></div>
     <div className="rounded-xl border border-white/15 bg-white/5 p-5"><h3 className="font-semibold">Atenção no briefing</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-200">{diagnosis.cautions.map(v=><li key={v}>{v}</li>)}</ul></div>
    </div>
    <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-5"><p className="text-xs uppercase tracking-wider text-zinc-400">Liberdade criativa sugerida</p><p className="mt-1 text-lg font-semibold">{diagnosis.freedom}</p><p className="mt-2 text-xs text-zinc-400">{diagnosis.notes}</p></div>
    <details className="mt-6 rounded-xl border border-white/15 p-5"><summary className="cursor-pointer font-semibold">Ver indicadores complementares</summary><div className="mt-5 space-y-5">{categories.map(k=><div key={k}><div className="mb-2 flex justify-between text-sm"><span>{labels[k][0]}</span><span>{labels[k][1]}</span></div><div className="h-2 rounded-full bg-white/15"><div className="h-2 rounded-full" style={{width:profile[k]+'%',background:ACCENT}}/></div></div>)}</div><p className="mt-4 text-xs text-zinc-400">As escalas são orientativas, não probabilidades ou medidas científicas.</p></details>
    <h2 className="mt-9 text-xl font-semibold">Detalhes para sua curadoria</h2><p className="mt-2 text-sm text-zinc-400">Estes campos são opcionais. As informações não são salvas no site: exporte o arquivo ou envie por e-mail para compartilhar.</p>
    <div className="mt-5 space-y-4">{freeText('cliente','Nome do cliente ou responsáveis',answers,setAnswers,'Seu nome')}{freeText('data','Data do evento',answers,setAnswers,'Ex.: 18/03/2028')}</div>
    <div className="mt-8 grid gap-3 sm:grid-cols-2"><button className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold" style={{background:ACCENT}} onClick={exportJSON}><Download size={17}/> Baixar briefing</button><button className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3" onClick={sendEmail}><Mail size={17}/> Enviar por e-mail</button></div>
    <button className="mt-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white" onClick={reset}><RotateCcw size={16}/> Começar novamente</button>
   </motion.section>}
   </AnimatePresence>
   <footer className="mt-20 border-t border-white/10 pt-5 text-center text-xs text-zinc-500">Cimioni Mateus · DNA Musical · Experiência de curadoria</footer>
  </div>
 </main>
}
