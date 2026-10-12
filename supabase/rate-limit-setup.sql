-- Execute in Supabase SQL Editor before deploying updated submit-dna function.
-- Limit to 5 submissions per hour per hashed network identifier.
create table if not exists public.dna_rate_limits (
  token_hash text not null,
  window_start timestamptz not null,
  attempts integer not null default 1,
  primary key (token_hash, window_start)
);
alter table public.dna_rate_limits enable row level security;
revoke all on public.dna_rate_limits from public, anon, authenticated;

create or replace function public.reserve_dna_submission(p_token_hash text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed boolean;
  current_window timestamptz := date_trunc('hour', now());
begin
  if p_token_hash is null or length(p_token_hash) != 64 or p_token_hash !~ '^[a-f0-9]{64}$' then
    return false;
  end if;

  insert into public.dna_rate_limits(token_hash, window_start, attempts)
  values (p_token_hash, current_window, 1)
  on conflict (token_hash, window_start)
  do update set attempts = public.dna_rate_limits.attempts + 1
    where public.dna_rate_limits.attempts < 5
  returning true into allowed;

  return coalesce(allowed, false);
end;
$$;

revoke all on function public.reserve_dna_submission(text) from public, anon, authenticated;
grant execute on function public.reserve_dna_submission(text) to service_role;

-- Old windows may be periodically deleted by a scheduled job.
