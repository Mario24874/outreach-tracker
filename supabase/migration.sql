-- ============================================================
-- OutreachTracker SaaS Schema
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- Users (synced from Clerk via webhook)
CREATE TABLE IF NOT EXISTS public.users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id     TEXT UNIQUE NOT NULL,
  email             TEXT UNIQUE NOT NULL,
  full_name         TEXT,
  phone             TEXT,
  company           TEXT,
  role              TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Solicitudes (quotes, requirements, developments, etc.)
CREATE TABLE IF NOT EXISTS public.solicitudes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tipo                TEXT NOT NULL CHECK (tipo IN ('cotizacion','requerimiento','implementacion','cambio','automatizacion','desarrollo','otro')),
  titulo              TEXT NOT NULL,
  descripcion         TEXT,
  estado              TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','en_revision','aprobada','rechazada','en_progreso','completada')),
  presupuesto_estimado DECIMAL(12,2),
  notas_admin         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Proyectos
CREATE TABLE IF NOT EXISTS public.proyectos (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  solicitud_id              UUID REFERENCES public.solicitudes(id),
  nombre                    TEXT NOT NULL,
  tipo                      TEXT NOT NULL,
  descripcion               TEXT,
  estado                    TEXT NOT NULL DEFAULT 'planificacion' CHECK (estado IN ('planificacion','en_progreso','pausado','completado','cancelado')),
  sprint_actual             INTEGER NOT NULL DEFAULT 1,
  sprints_total             INTEGER NOT NULL DEFAULT 1,
  presupuesto_total         DECIMAL(12,2),
  pago_inicial              DECIMAL(12,2),
  pago_inicial_recibido     BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_inicio              DATE,
  fecha_entrega_estimada    DATE,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tickets
CREATE TABLE IF NOT EXISTS public.tickets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  proyecto_id   UUID REFERENCES public.proyectos(id),
  titulo        TEXT NOT NULL,
  descripcion   TEXT NOT NULL,
  prioridad     TEXT NOT NULL DEFAULT 'media' CHECK (prioridad IN ('baja','media','alta','critica')),
  estado        TEXT NOT NULL DEFAULT 'abierto' CHECK (estado IN ('abierto','en_progreso','resuelto','cerrado')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mensajes (chat + email + whatsapp logs)
CREATE TABLE IF NOT EXISTS public.mensajes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  proyecto_id   UUID REFERENCES public.proyectos(id),
  canal         TEXT NOT NULL CHECK (canal IN ('chat','email','whatsapp')),
  remitente     TEXT NOT NULL CHECK (remitente IN ('cliente','admin')),
  contenido     TEXT NOT NULL,
  leido         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id      ON public.users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_user_id      ON public.solicitudes(user_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado       ON public.solicitudes(estado);
CREATE INDEX IF NOT EXISTS idx_proyectos_user_id        ON public.proyectos(user_id);
CREATE INDEX IF NOT EXISTS idx_proyectos_estado         ON public.proyectos(estado);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id          ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado           ON public.tickets(estado);
CREATE INDEX IF NOT EXISTS idx_mensajes_user_id         ON public.mensajes(user_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_canal           ON public.mensajes(canal);
CREATE INDEX IF NOT EXISTS idx_mensajes_created_at      ON public.mensajes(created_at DESC);

-- ============================================================
-- RLS — all data access goes through Next.js server with service role.
-- Direct anon API access is blocked.
-- ============================================================
ALTER TABLE public.users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyectos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes    ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically (Supabase default).
-- No anon policies = anon key returns empty/forbidden.
-- Add policies here later when adding Supabase Realtime with Clerk JWT.

-- ============================================================
-- updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE OR REPLACE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_updated_at_solicitudes
  BEFORE UPDATE ON public.solicitudes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_updated_at_proyectos
  BEFORE UPDATE ON public.proyectos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_updated_at_tickets
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
