import React, { useEffect, useMemo, useState } from 'react'
import { LockKeyhole, LogOut, Search, RefreshCw, ArrowLeft, CalendarDays, FileText } from 'lucide-react'
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './dnaSupabase.js'

const headers = (token) => ({ apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: 'Bearer ' + token })
const fmt = (date) => date ? new Date(date).toLocaleDateString('pt-BR') : 'Não informada'
const formatEventDate = (record) => record.event_date
  ? record.event_date.split('-').reverse().join('/')
  : record.answers?.data || 'Não informada'

export default function DNAAdmin() {
 const [session,setSession] = useState(null)
 const [email,setEmail] = useState('')
 const [password,setPassword] = useState('')
 const [loading,setLoading] = useState(false)
 const [message,setMessage] = useState('')
 const [records,setRecords] = useState([])
 const [search,setSearch] = useState('')
 const [selected,setSelected] = useState(null)
 const [verified,setVerified] = useState(false)

 async function refresh(token) {
  const response=await fetch(SUPABASE_URL+'/rest/v1/dna_submissions?select=*&order=created_at.desc&limit=200',{headers:headers(token)})
  if(!response.ok) throw new Error('Não foi possível acessar os briefings. Verifique as permissões de administrador.')
  setRecords(await response.json())
 }
 async function authenticate(e) {
  e.preventDefault();setLoading(true);setMessage('')
  try {
   const response=await fetch(SUPABASE_URL+'/auth/v1/token?grant_type=password',{
    method:'POST',headers:{'Content-Type':'application/json',apikey:SUPABASE_PUBLISHABLE_KEY},
    body:JSON.stringify({email,password}),
   })
   const payload=await response.json()
   if(!response.ok||!payload.access_token) throw new Error('Não foi possível entrar. Confira e-mail e senha.')
   const check=await fetch(SUPABASE_URL+'/rest/v1/rpc/is_dna_admin',{
    method:'POST',headers:{...headers(payload.access_token),'Content-Type':'application/json'},body:'{}',
   })
   if(!check.ok||await check.json()!==true) throw new Error('Esta conta não tem permissão administrativa.')
   await refresh(payload.access_token)
   setSession({token:payload.access_token})
   setVerified(true)
   setPassword('')
  } catch(err) {setMessage(err.message||'Erro de autenticação.')} finally {setLoading(false)}
 }
 const filtered=useMemo(()=>records.filter(r=>{
  const term=search.trim().toLocaleLowerCase('pt-BR')
  return !term || [r.client_name,r.event_type,r.event_date,r.answers?.data,r.diagnosis?.archetype]
   .some(v=>String(v||'').toLocaleLowerCase('pt-BR').includes(term))
 }),[records,search])
 function logout(){setSession(null);setRecords([]);setSelected(null);setVerified(false);setPassword('');setMessage('')}
 const panel='rounded-2xl border border-white/15 bg-[#112D31] p-5'
 return <main className="min-h-screen bg-[#061C20] px-5 py-8 text-white">
  <div className="mx-auto max-w-6xl">
   <header className="flex items-center justify-between gap-3 border-b border-white/15 pb-5">
    <a href="/" className="flex items-center gap-2 text-sm text-zinc-300"><ArrowLeft size={17}/> Site principal</a>
    <span className="flex items-center gap-2 text-sm font-semibold text-orange-400"><LockKeyhole size={17}/> DNA Musical · Administração</span>
   </header>
   {!session?<div className="mx-auto mt-16 max-w-md rounded-2xl border border-white/15 bg-[#112D31] p-7">
    <h1 className="text-3xl font-bold">Acesso privado</h1>
    <p className="mt-2 text-sm text-zinc-300">Entre com tua conta administrativa do Supabase.</p>
    <form onSubmit={authenticate} className="mt-7 space-y-4">
     <label className="block text-sm">E-mail<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/25 bg-white/5 p-3 text-white"/></label>
     <label className="block text-sm">Senha<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-white/25 bg-white/5 p-3 text-white"/></label>
     <button disabled={loading} type="submit" className="w-full rounded-xl bg-[#EC6E1A] px-4 py-3 font-semibold disabled:opacity-50">{loading?'Entrando...':'Entrar no painel'}</button>
    </form>
    {message&&<p role="alert" className="mt-4 text-sm text-orange-300">{message}</p>}
   </div>:<div className="pt-9">
    <div className="flex flex-wrap items-end justify-between gap-4">
     <div><p className="text-xs uppercase tracking-widest text-orange-400">Área privada</p><h1 className="mt-2 text-3xl font-bold">Briefings recebidos</h1><p className="mt-2 text-sm text-zinc-300">{verified?'Sessão administrativa verificada':''}</p></div>
     <div className="flex gap-2">
      <button onClick={()=>{refresh(session.token).catch(e=>setMessage(e.message))}} className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm"><RefreshCw size={16}/> Atualizar</button>
      <button onClick={logout} className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm"><LogOut size={16}/> Sair</button>
     </div>
    </div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className={panel}><p className="text-sm text-zinc-400">Briefings recentes (até 200)</p><p className="mt-2 text-3xl font-semibold">{records.length}</p></div>
      <div className={panel}><p className="text-sm text-zinc-400">Resultados da busca</p><p className="mt-2 text-3xl font-semibold">{filtered.length}</p></div>
    </div>
    <label className="mt-6 flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 p-3"><Search size={19}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nome, evento ou arquétipo..." className="w-full bg-transparent text-sm text-white outline-none"/></label>
    {message&&<p role="alert" className="mt-4 text-orange-300">{message}</p>}
    <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
     <div className="space-y-2">{filtered.map(r=><button key={r.id} onClick={()=>setSelected(r)} className={'w-full rounded-xl border p-4 text-left '+(selected?.id===r.id?'border-orange-500 bg-orange-500/10':'border-white/15 bg-white/5 hover:border-white/35')}>
      <div className="flex items-center justify-between gap-2"><strong>{r.client_name||'Cliente'}</strong><span className="text-xs text-zinc-400">{fmt(r.created_at)}</span></div>
      <p className="mt-1 text-sm text-zinc-300">{r.event_type} · {formatEventDate(r)}</p>
      <p className="mt-1 text-xs text-orange-300">{r.diagnosis?.archetype||'Perfil musical'}</p>
     </button>)}{!filtered.length&&<p className="text-sm text-zinc-400">Nenhum briefing encontrado.</p>}</div>
     <section className={panel}>
      {!selected?<div className="flex min-h-64 flex-col items-center justify-center gap-2 text-zinc-400"><FileText size={30}/><p>Selecione um briefing para visualizar.</p></div>:<div className="space-y-5">
       <div><p className="text-xs uppercase tracking-widest text-orange-400">Briefing do cliente</p><h2 className="mt-2 text-2xl font-bold">{selected.client_name}</h2><p className="mt-2 flex items-center gap-2 text-sm text-zinc-300"><CalendarDays size={16}/>{selected.event_type} · {formatEventDate(selected)}</p></div>
       <div className="rounded-xl bg-orange-500/10 p-4"><p className="text-xs text-orange-300">IDENTIDADE PREDOMINANTE</p><h3 className="mt-2 text-xl font-semibold">{selected.diagnosis?.archetype}</h3><p className="mt-2 text-sm">{selected.diagnosis?.summary}</p></div>
       <div><h3 className="mb-2 font-semibold">Referências e respostas</h3><dl className="space-y-3">{Object.entries(selected.answers||{}).map(([key,value])=><div key={key} className="border-b border-white/10 pb-2"><dt className="text-xs text-orange-300">{key.replaceAll('_',' ')}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm">{String(value??'')}</dd></div>)}</dl></div>
       <div><h3 className="mb-2 font-semibold">Prioridades da curadoria</h3><ul className="list-disc space-y-1 pl-5 text-sm">{(selected.diagnosis?.prioritize||[]).map((x,i)=><li key={i}>{x}</li>)}</ul></div>
       <button onClick={()=>{const blob=new Blob([JSON.stringify(selected,null,2)],{type:'application/json'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='briefing-'+selected.id+'.json';a.click();URL.revokeObjectURL(u)}} className="rounded-lg border border-white/25 px-4 py-2 text-sm">Baixar briefing completo</button>
      </div>}
     </section>
    </div>
   </div>}
  </div>
 </main>
}
