// Presentation labels for submitted answers. These are not used as database keys.
export const questionGroups = [
  {title:'Identidade e relação com a música',ids:['uso_musical','lembranca','artistas_pessoais','faixas_pessoais']},
  {title:'A experiência da pista',ids:['foco_pista','surpresa','transicoes']},
  {title:'Estilos e versões',ids:['genero_base','detalhe_pop___dance','detalhe_eletr_nica___house','detalhe_pagode___samba','detalhe_funk___urbano','detalhe_rock___cl_ssicos','detalhe_sertanejo___country','detalhe_mpb___brasilidades','detalhe_latino___reggaeton','versoes_remixes']},
  {title:'Repertório e restrições',ids:['artistas_festa','faixas_festa','restricoes_festa']},
  {title:'Preferências do evento',ids:['casamento_foco','aniversario_memoria','formatura_turma','corporativo_objetivo']},
  {title:'Identificação',ids:['cliente','data']}
]
export const questionLabels = {
 uso_musical:'Quando você ouve música no dia a dia e pensa na festa, qual afirmação descreve melhor você?',
 lembranca:'Qual dessas experiências mais combina com sua relação com a música?',
 artistas_pessoais:'Quais artistas realmente fazem parte do seu gosto pessoal?',
 faixas_pessoais:'Quais músicas representam você, mesmo que não sejam para a festa?',
 foco_pista:'O que você prefere no momento mais animado?',
 surpresa:'Qual é a sua abertura para músicas menos conhecidas?',
 transicoes:'Em relação à mistura de estilos na festa...',
 genero_base:'Qual universo musical você mais gostaria de explorar na festa?',
 versoes_remixes:'Para esse estilo musical, como você prefere que o DJ trabalhe as versões das músicas?',
 artistas_festa:'Quais artistas você gostaria de ouvir na festa?',
 faixas_festa:'Quais músicas são indispensáveis na festa?',
 restricoes_festa:'O que você NÃO quer ouvir na festa?',
 casamento_foco:'O que vocês priorizam na trilha do casamento?',
 aniversario_memoria:'O que mais deveria aparecer na festa?',
 formatura_turma:'Qual é a identidade musical da turma?',
 corporativo_objetivo:'Qual é a prioridade musical do evento?',
 cliente:'Nome do cliente ou responsáveis',
 data:'Data do evento'
}
export function labelForAnswer(key) {
 if (key.startsWith('detalhe_')) return 'Dentro desse universo, qual direção combina mais com sua festa?'
 return questionLabels[key] || key.replaceAll('_',' ')
}
export function groupedAnswers(answers={}) {
 const seen=new Set()
 const groups=questionGroups.map(group=>({
  title:group.title,
  entries:group.ids.filter(id=>Object.hasOwn(answers,id)).map(id=>{
    seen.add(id);return {key:id,label:labelForAnswer(id),value:String(answers[id]??'')}
  })
 })).filter(group=>group.entries.length)
 const extra=Object.keys(answers).filter(key=>!seen.has(key)).map(key=>({key,label:labelForAnswer(key),value:String(answers[key]??'')}))
 if(extra.length)groups.push({title:'Outras respostas',entries:extra})
 return groups
}
