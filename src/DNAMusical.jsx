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
const common = [
 q('ambiente','Em qual desses lugares você mais gostaria de estar?',[
  ['Em um festival com todo mundo dançando',{energia:2,popular:1}],
  ['Em um beach club ao pôr do sol',{energia:0,brasil:-1,mistura:-1}],
  ['Em uma roda de amigos cantando clássicos',{nostalgia:2,popular:2,brasil:1}],
  ['Em uma festa elegante com música envolvente',{popular:-2,mistura:-1}]
 ]),
 q('lembranca','Qual dessas experiências mais combina com sua relação com a música?',[
  ['Relembrar músicas que marcaram fases da vida',{nostalgia:3}],
  ['Descobrir sons e artistas novos',{nostalgia:-3}],
  ['Cantar sucessos com as pessoas que amo',{nostalgia:1,popular:2}],
  ['Sentir o ritmo e dançar sem parar',{energia:2}]
 ]),
 q('preferencia','Qual clima você gostaria de ver na pista?',[
  ['Hits brasileiros que todo mundo canta',{popular:2,brasil:3}],
  ['Pop e dance internacionais',{popular:2,brasil:-3,energia:1}],
  ['House e eletrônica com groove',{popular:-1,brasil:-2,mistura:-1}],
  ['Vários estilos e surpresas pela noite',{mistura:3}]
 ]),
 q('pista','Quando a festa atingir seu auge, você prefere...',[
  ['Muita intensidade e explosão',{energia:3}],
  ['Uma energia crescente e envolvente',{energia:-2}],
  ['Todos cantando juntos',{popular:3,nostalgia:1}],
  ['Uma mistura inesperada de estilos',{mistura:3}]
 ]),
 q('transicoes','Em relação à mistura de estilos na festa...',[
  ['Prefiro blocos mais longos com a mesma atmosfera',{mistura:-3}],
  ['Adoro passar de um estilo para outro',{mistura:3}],
  ['Depende do momento e dos convidados',{mistura:0,popular:1}]
 ]),
 q('remix','Quando toca uma música que você ama, o que prefere?',[
  ['A versão original, com toda a memória que ela carrega',{nostalgia:2}],
  ['Uma releitura ou remix surpreendente',{nostalgia:-2,mistura:1}],
  ['Tanto faz, desde que a pista responda bem',{popular:2}]
 ]),
]
const specific = {
 casamento:[
  q('casamento_foco','O que vocês priorizam na trilha do casamento?',[
   ['Nossa identidade, mesmo com gostos menos populares',{popular:-3}],
   ['Uma pista que agrade à maioria dos convidados',{popular:3}],
   ['Um equilíbrio entre nosso gosto e a energia dos convidados',{popular:1,mistura:1}]
  ]),
  q('casamento_momento','Qual momento vocês mais querem ver acontecer?',[
   ['Todos cantando juntos um grande clássico',{nostalgia:2,popular:2}],
   ['Uma pista tomada pela energia de um hit',{energia:3}],
   ['Uma sequência elegante e envolvente',{energia:-1,popular:-1}]
  ])
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
  const option=item.options.find(o=>o.label===answers[item.id])
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
 const questions=useMemo(()=>[...common,...(specific[type]||[])], [type])
 const profile=useMemo(()=>compute(answers,questions),[answers,questions])
 const chosen=questions[step]
 const category=types.find(t=>t[0]===type)
 const complete=()=>{if(!answers[chosen.id]){setError('Escolha uma alternativa para continuar.');return}setError('');if(step===questions.length-1)setFinished(true);else setStep(s=>s+1)}
 const reset=()=>{setType('');setStep(0);setAnswers({});setFinished(false);setError('')}
 const result={version:'1.0',eventType:category?.[1],answers,profile,generatedAt:new Date().toISOString()}
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
    <div className="mt-8 space-y-3">{chosen.options.map(o=><button key={o.label} type="button" onClick={()=>{setAnswers(a=>({...a,[chosen.id]:o.label}));setError('')}} className={'w-full rounded-xl border px-5 py-4 text-left transition '+(answers[chosen.id]===o.label?'border-[#EC6E1A] bg-[#EC6E1A]/15':'border-white/15 bg-white/5 hover:border-white/40')} aria-pressed={answers[chosen.id]===o.label}>{o.label}</button>)}</div>
    {error&&<p role="alert" className="mt-4 text-sm text-orange-300">{error}</p>}
    <div className="mt-10 flex justify-between gap-3"><button className="rounded-xl border border-white/20 px-5 py-3" onClick={()=>step?setStep(s=>s-1):setType('')}>Voltar</button><button className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white" style={{background:ACCENT}} onClick={complete}>{step===questions.length-1?'Ver meu DNA':'Próxima'} <ArrowRight size={18}/></button></div>
   </motion.section>:<motion.section key="result" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="pt-12">
    <p className="text-xs uppercase tracking-[.3em]" style={{color:ACCENT}}>Seu resultado</p><h1 className="mt-3 text-4xl font-bold">Seu DNA Musical</h1><p className="mt-3 text-zinc-300">Um retrato inicial das preferências para a festa — para aprofundarmos juntos na curadoria.</p>
    <div className="mt-8 space-y-6 rounded-2xl border border-white/15 bg-white/5 p-6">{categories.map(k=><div key={k}><div className="mb-2 flex justify-between text-sm"><span>{labels[k][0]}</span><span>{labels[k][1]}</span></div><div className="h-2 rounded-full bg-white/15"><div className="h-2 rounded-full" style={{width:profile[k]+'%',background:ACCENT}}/></div><p className="mt-1 text-right text-xs text-zinc-400">{profile[k]} / 100</p></div>)}</div>
    <h2 className="mt-9 text-xl font-semibold">Detalhes para sua curadoria</h2><p className="mt-2 text-sm text-zinc-400">Estes campos são opcionais. As informações não são salvas no site: exporte o arquivo ou envie por e-mail para compartilhar.</p>
    <div className="mt-5 space-y-4">{freeText('cliente','Nome do cliente ou responsáveis',answers,setAnswers,'Seu nome')}{freeText('data','Data do evento',answers,setAnswers,'Ex.: 18/03/2028')}{freeText('artistas','Artistas e estilos favoritos',answers,setAnswers,'Quais não podem faltar?',true)}{freeText('obrigatorias','Músicas obrigatórias',answers,setAnswers,'Artista — música',true)}{freeText('restricoes','Músicas ou estilos que não devem tocar',answers,setAnswers,'Restrições',true)}</div>
    <div className="mt-8 grid gap-3 sm:grid-cols-2"><button className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold" style={{background:ACCENT}} onClick={exportJSON}><Download size={17}/> Baixar briefing</button><button className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3" onClick={sendEmail}><Mail size={17}/> Enviar por e-mail</button></div>
    <button className="mt-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white" onClick={reset}><RotateCcw size={16}/> Começar novamente</button>
   </motion.section>}
   </AnimatePresence>
   <footer className="mt-20 border-t border-white/10 pt-5 text-center text-xs text-zinc-500">Cimioni Mateus · DNA Musical · Experiência de curadoria</footer>
  </div>
 </main>
}
