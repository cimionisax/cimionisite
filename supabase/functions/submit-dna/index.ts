// Deploy as Supabase Edge Function named "submit-dna" with JWT verification disabled.
// Requires default SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY secrets provided by Supabase.
// Run supabase/rate-limit-setup.sql before deploying; review privacy notice before launch.
import { createClient } from 'npm:@supabase/supabase-js@2'

const allowedOrigins = new Set([
  'https://cimionimateus.com.br',
  'https://www.cimionimateus.com.br',
])
const isAllowedOrigin = (origin: string | null) => {
  if (!origin) return true
  if (allowedOrigins.has(origin)) return true
  try {
    const url = new URL(origin)
    return url.protocol === 'https:' && (
      url.hostname === 'stackblitz.com' ||
      url.hostname.endsWith('.webcontainer.io')
    )
  } catch { return false }
}
const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && isAllowedOrigin(origin) ? origin : 'https://cimionimateus.com.br',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, apikey, authorization, x-client-info',
  'Vary': 'Origin',
  'Content-Type': 'application/json; charset=utf-8',
})
const reply = (status: number, data: Record<string, unknown>, origin: string | null) =>
  new Response(JSON.stringify(data), { status, headers: corsHeaders(origin) })
const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v)

Deno.serve(async req => {
  const origin = req.headers.get('origin')
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) })
  if (req.method !== 'POST') return reply(405, { error: 'Método não permitido.' }, origin)
  if (origin && !isAllowedOrigin(origin)) return reply(403, { error: 'Origem não permitida.' }, origin)
  const size = Number(req.headers.get('content-length') || 0)
  if (size > 64000) return reply(413, { error: 'Formulário muito grande.' }, origin)
  let data: unknown
  try { data = await req.json() } catch { return reply(400, { error: 'Formato inválido.' }, origin) }
  if (!isRecord(data)) return reply(400, { error: 'Dados inválidos.' }, origin)
  if (JSON.stringify(data).length > 64000) return reply(413, { error: 'Formulário muito grande.' }, origin)
  const { eventType, answers, profile, diagnosis } = data
  if (!['Casamento', 'Aniversário', 'Formatura', 'Corporativo'].includes(String(eventType)) ||
      !isRecord(answers) || !isRecord(profile) || !isRecord(diagnosis)) {
    return reply(400, { error: 'Formulário incompleto.' }, origin)
  }
  const name = String(answers.cliente || '').trim().slice(0, 200)
  const dateString = String(answers.data || '').trim()
  // Client date is optional for now; store it in answers, not event_date, if not ISO.
  const eventDate = /^\d{4}-\d{2}-\d{2}$/.test(dateString) ? dateString : null
  if (!name) return reply(400, { error: 'Informe seu nome antes de enviar.' }, origin)
  const url = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !serviceKey) return reply(503, { error: 'Serviço ainda não configurado.' }, origin)
  const db = createClient(url, serviceKey, { auth: { persistSession: false } })
  // Best-effort network limit. Origin headers alone are not anti-bot protection.
  // Hash the network address with a server-only secret; no raw IP is stored.
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const remote = req.headers.get('cf-connecting-ip') || forwarded || 'unavailable'
  const encoded = new TextEncoder().encode(remote + ':' + serviceKey)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  const token = Array.from(new Uint8Array(digest), v => v.toString(16).padStart(2, '0')).join('')
  const { data: allowed, error: limitError } = await db.rpc('reserve_dna_submission', { p_token_hash: token })
  if (limitError) {
    console.error('Rate limiter failure:', limitError.code)
    return reply(503, { error: 'Serviço temporariamente indisponível.' }, origin)
  }
  if (!allowed) return reply(429, { error: 'Limite de envios atingido. Tente novamente mais tarde.' }, origin)
  const { error } = await db.from('dna_submissions').insert({
    client_name: name, event_date: eventDate, event_type: eventType,
    answers, profile, diagnosis, status: 'received'
  })
  if (error) { console.error('Submission failed:', error.code); return reply(500, { error: 'Não foi possível registrar o formulário.' }, origin) }
  return reply(201, { ok: true }, origin)
})
