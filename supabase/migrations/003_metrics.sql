-- MarioOS — Metrics & Admin Portal
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
--
-- Tablas para el portal admin privado (/admin):
--   page_views      → visitas anónimas (portfolio + app)
--   demo_runs       → demos/agentes IA probados desde el portfolio
--   email_events    → respuestas entrantes (Gmail Reply Tracker → /api/webhook/email)
--   contact_messages→ formulario de contacto del portfolio (quién escribió + mensaje)
--   scrape_events   → lotes de scraping notificados por n8n (/api/webhook/n8n)
--
-- `outreach_log` (leads scrapeados) YA existe — la alimenta n8n; aquí no se toca.
--
-- RLS: se habilita SIN políticas públicas. Estas tablas son privadas del owner;
-- todo el acceso ocurre server-side con la SERVICE ROLE key (bypassa RLS).
-- La anon key NO puede leerlas ni escribirlas.

-- ============================================================
-- PAGE VIEWS  (visitas anónimas)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.page_views (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_id          TEXT        NOT NULL,
  area             TEXT        NOT NULL DEFAULT 'portfolio' CHECK (area IN ('portfolio', 'app')),
  path             TEXT        NOT NULL,
  section          TEXT,
  referrer         TEXT,
  user_agent       TEXT,
  country          TEXT,
  duration_seconds INTEGER,
  entered_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_page_views_entered ON public.page_views (entered_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_anon    ON public.page_views (anon_id);
CREATE INDEX IF NOT EXISTS idx_page_views_area    ON public.page_views (area);

-- ============================================================
-- DEMO RUNS  (demos de IA probados)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.demo_runs (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_id       TEXT,
  demo          TEXT        NOT NULL,
  input_preview TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_demo_runs_created ON public.demo_runs (created_at DESC);

-- ============================================================
-- EMAIL EVENTS  (respuestas entrantes — Gmail Reply Tracker)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.email_events (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  direction       TEXT        NOT NULL DEFAULT 'inbound_reply',
  from_email      TEXT,
  from_name       TEXT,
  subject         TEXT,
  body_preview    TEXT,
  outreach_log_id TEXT,
  received_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_email_events_received ON public.email_events (received_at DESC);

-- ============================================================
-- CONTACT MESSAGES  (formulario de contacto del portfolio)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT,
  email      TEXT,
  phone      TEXT,
  message    TEXT,
  source     TEXT        DEFAULT 'portfolio',
  anon_id    TEXT,
  status     TEXT        NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON public.contact_messages (created_at DESC);

-- ============================================================
-- SCRAPE EVENTS  (lotes de scraping notificados por n8n)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.scrape_events (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow      TEXT,
  event         TEXT,
  query         TEXT,
  business_name TEXT,
  email         TEXT,
  payload       JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_scrape_events_created ON public.scrape_events (created_at DESC);

-- ============================================================
-- RLS — habilitado sin políticas (solo service role accede)
-- ============================================================
ALTER TABLE public.page_views       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_runs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_events    ENABLE ROW LEVEL SECURITY;
