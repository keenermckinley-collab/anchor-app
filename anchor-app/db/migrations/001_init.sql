-- Anchor MVP PostgreSQL schema

create extension if not exists "pgcrypto";

create type employment_status as enum (
  'full_time_employee',
  'contractor',
  'customer',
  'consultant',
  'no_longer_affiliated'
);

create type delivery_status as enum (
  'queued',
  'sent',
  'delivered',
  'opened',
  'bounced',
  'failed'
);

create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  auth_provider text not null,
  mfa_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  full_name text not null,
  relationship_to_user text,
  created_at timestamptz not null default now()
);

create table records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  subject_id uuid references subjects(id) on delete set null,
  employment_status employment_status,
  happened_at timestamptz,
  submitted_at timestamptz not null default now(),
  what_happened text not null,
  who_was_involved text,
  witnesses text,
  who_was_told text,
  created_at timestamptz not null default now()
);

create table record_amendments (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references records(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  note text not null,
  submitted_at timestamptz not null default now()
);

create table assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  storage_key text not null unique,
  file_name text not null,
  content_type text not null,
  size_bytes bigint not null,
  checksum_sha256 text,
  scan_status text not null default 'pending',
  uploaded_at timestamptz not null default now()
);

create table record_assets (
  id uuid primary key default gen_random_uuid(),
  record_id uuid references records(id) on delete cascade,
  amendment_id uuid references record_amendments(id) on delete cascade,
  asset_id uuid not null references assets(id) on delete cascade,
  attached_at timestamptz not null default now(),
  check ((record_id is not null) <> (amendment_id is not null))
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  generated_at timestamptz not null default now(),
  storage_key text not null,
  sha256 text,
  preview_url text
);

create table share_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  report_id uuid not null references reports(id) on delete cascade,
  recipient_name text,
  recipient_role text,
  recipient_email text not null,
  message_body text,
  delivery_status delivery_status not null default 'queued',
  receipt_confirmed_at timestamptz,
  parse_replies_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table delivery_events (
  id uuid primary key default gen_random_uuid(),
  share_action_id uuid not null references share_actions(id) on delete cascade,
  provider text not null,
  event_type text not null,
  event_payload jsonb,
  occurred_at timestamptz not null default now()
);

create table audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  actor_type text not null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_records_user_submitted_at on records(user_id, submitted_at desc);
create index idx_record_amendments_record_submitted_at on record_amendments(record_id, submitted_at desc);
create index idx_share_actions_user_created_at on share_actions(user_id, created_at desc);
create index idx_delivery_events_share_action on delivery_events(share_action_id, occurred_at desc);

create view user_rights_summary as
select
  u.id as user_id,
  u.email,
  count(distinct r.id) as record_count,
  count(distinct a.id) as asset_count,
  count(distinct rep.id) as report_count
from users u
left join records r on r.user_id = u.id
left join assets a on a.user_id = u.id
left join reports rep on rep.user_id = u.id
group by u.id, u.email;
