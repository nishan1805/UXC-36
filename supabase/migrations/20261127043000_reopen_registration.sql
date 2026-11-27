-- Remove the 26 Nov 2026 11:59 PM IST registration close.
-- registration_open() stays so the current site keeps working, and always reports open.
-- register_participant no longer rejects inserts after that timestamp.
-- Duplicate-mobile checks, participant numbering, and payment status are unchanged.

create or replace function public.registration_open()
returns boolean
language sql
stable
set search_path to ''
as $function$
  select true;
$function$;

create or replace function public.register_participant(
  p_full_name text,
  p_mobile text,
  p_city text,
  p_payment_proof_path text
)
returns table(id uuid, participant_no bigint, full_name text, city text, payment_status text)
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_name text := btrim(coalesce(p_full_name, ''));
  v_city text := btrim(coalesce(p_city, ''));
  v_mobile text := regexp_replace(coalesce(p_mobile, ''), '\D', '', 'g');
  v_no bigint;
  v_row public.registrations%rowtype;
begin
  if char_length(v_name) < 2 or char_length(v_name) > 100 then
    raise exception 'Please enter a valid full name' using errcode = 'P0001';
  end if;
  if v_mobile !~ '^[6-9][0-9]{9}$' then
    raise exception 'Please enter a valid 10-digit mobile number' using errcode = 'P0001';
  end if;
  if char_length(v_city) < 2 or char_length(v_city) > 100 then
    raise exception 'Please enter a valid city' using errcode = 'P0001';
  end if;
  if p_payment_proof_path is null or p_payment_proof_path !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp)$' then
    raise exception 'Please upload your payment screenshot' using errcode = 'P0001';
  end if;

  -- one registration at a time gets a number, so numbers stay 1,2,3 with no gaps
  perform pg_advisory_xact_lock(hashtext('uxc_participant_no'));

  if exists (select 1 from public.registrations r where r.mobile = v_mobile) then
    raise exception 'This mobile number is already registered' using errcode = 'P0001';
  end if;

  select coalesce(max(r.participant_no), 0) + 1 into v_no from public.registrations r;

  begin
    insert into public.registrations (participant_no, full_name, mobile, city, payment_proof_path)
    values (v_no, v_name, v_mobile, v_city, p_payment_proof_path)
    returning * into v_row;
  exception when unique_violation then
    raise exception 'This mobile number is already registered' using errcode = 'P0001';
  end;

  return query select v_row.id, v_row.participant_no, v_row.full_name, v_row.city, v_row.payment_status;
end;
$function$;
