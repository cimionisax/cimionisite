// Public browser configuration. Never put service_role or secret keys in this file.
export const SUPABASE_URL = 'https://beeyyilfpeenlhdtwqzo.supabase.co'
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Ps1h9AIiaBemKBwYdZeBcw_WppDZjTP'

export async function submitDNA(report) {
  const response = await fetch(SUPABASE_URL + '/functions/v1/submit-dna', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(report),
  })
  let payload
  try { payload = await response.json() } catch { payload = {} }
  if (!response.ok) throw new Error(payload.error || 'Não foi possível enviar. Tente novamente.')
  return payload
}
