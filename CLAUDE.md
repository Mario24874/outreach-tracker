# MarioOS — Claude Code Guide

SaaS MVP para pasar App Review de Meta. Permite enviar/recibir mensajes de WhatsApp y gestionar templates desde una UI real.

## Contexto del proyecto
- **Objetivo:** Demostrar `whatsapp_business_messaging`, `whatsapp_business_management` y `public_profile` a Meta reviewers
- **Deploy:** Easypanel (Docker standalone) en `app.mariomoreno.work`
- **Repo GitHub:** `Mario24874/outreach-tracker` (este repo)

## Stack
- Next.js 14.2 App Router, TypeScript strict
- Tailwind CSS (dark theme: bg #020617, accent #6366f1, WhatsApp #25D366)
- Supabase (Postgres + Auth con magic link + Google)
- Meta WhatsApp Cloud API directa (sin YCloud)
- Auth: Supabase SSR (`@supabase/ssr`) — NO Clerk

## Estructura clave
- `lib/supabase/client.ts` — browser client
- `lib/supabase/server.ts` — server components client
- `lib/whatsapp.ts` — sendTextMessage, sendTemplateMessage, listTemplates, createTemplate
- `app/api/whatsapp/send/route.ts` — POST: enviar mensaje
- `app/api/whatsapp/webhook/route.ts` — GET: verificar webhook, POST: recibir eventos
- `app/api/whatsapp/templates/route.ts` — GET/POST: listar/crear templates
- `app/api/whatsapp/templates/sync/route.ts` — POST: sincronizar templates desde Meta
- `supabase/migrations/001_initial.sql` — schema completo con RLS

## Páginas críticas para Meta Review
- `/dashboard/whatsapp` — chat 3 columnas (lista | conversación | contacto)
- `/dashboard/templates` — listar, sincronizar, crear templates + enviar con placeholders
- `/privacy` — Privacy Policy pública (no requiere auth)

## Variables de entorno requeridas
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
META_WHATSAPP_TOKEN
META_PHONE_NUMBER_ID
META_WABA_ID
META_APP_SECRET
META_VERIFY_TOKEN
NEXT_PUBLIC_APP_URL=https://app.mariomoreno.work
```

## Reglas de código
- `'use client'` solo donde hay interactividad real
- No crear `createClient()` en module scope — siempre dentro de handlers/functions
- `export const dynamic = 'force-dynamic'` en root layout (ya configurado)
- Webhook: siempre retornar 200 a Meta aunque haya error interno
- No loggear tokens ni secrets
