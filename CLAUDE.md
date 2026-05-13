# OutreachTracker — Claude Code Guide

Dashboard Next.js para monitorear sistema de email outreach B2B automatizado con n8n + Supabase.

## Stack
- Next.js 16 App Router, TypeScript strict
- Tailwind CSS v4 + shadcn/ui
- Supabase (`@supabase/supabase-js` v2 + `@supabase/ssr`)
- Recharts para gráficas, lucide-react para íconos
- Deploy: Easypanel (Docker standalone), mismo VPS que n8n

## Rutas clave
- `lib/types.ts` — tipos OutreachLog, OutreachProspect
- `lib/supabase/server.ts` — createClient() para Server Components
- `lib/supabase/client.ts` — createClient() para Client Components (Realtime)
- `app/api/webhook/n8n/route.ts` — webhook interno desde n8n

## Reglas de código
- Cero `any`. Tipos de `lib/types.ts` siempre.
- Server Components por defecto. `'use client'` solo donde hay interactividad.
- Filtros en URL params (useSearchParams), nunca useState.
- Supabase Realtime solo en RealtimeTable del Dashboard.
- Webhook: nunca loggear ni retornar N8N_WEBHOOK_SECRET.
- La app nunca escribe en `outreach_log`. Solo lee. Solo escribe en `outreach_prospects`.

## Reglas de Engineering (Aplican a cada tarea)

Sesgo: cautela sobre velocidad en trabajo no trivial. Usa juicio en tareas triviales.

### Regla 1 — Piensa antes de codear
Declara tus suposiciones explícitamente. Si no estás seguro, pregunta en vez de adivinar. Presenta múltiples interpretaciones cuando haya ambigüedad. Cuestiona cuando exista un enfoque más simple. Detente cuando estés confundido. Nombra qué no está claro.

### Regla 2 — Simplicidad primero
Código mínimo que resuelve el problema. Nada especulativo. Sin features que no se pidieron. Sin abstracciones para código de uso único. Test: ¿un ingeniero senior diría que esto está sobrecomplicado? Si sí, simplifica.

### Regla 3 — Cambios quirúrgicos
Toca solo lo que debas. Limpia solo tu propio desorden. No "mejores" código adyacente, comentarios o formato. No refactorices lo que no está roto. Sigue el estilo existente.

### Regla 4 — Ejecución por objetivos
Define criterios de éxito. Itera hasta verificar. No sigas pasos. Define qué es éxito e itera. Criterios fuertes te dejan iterar de manera independiente.

### Regla 5 — Usa el modelo solo para decisiones de juicio
Úsame para: clasificación, redacción, resumen, extracción de texto no estructurado. NO me uses para: ruteo, reintentos, transformaciones determinísticas, manejo de códigos de estado. Si el código puede responder, el código responde.

### Regla 6 — Los presupuestos de tokens no son sugerencias
Por tarea: 4,000 tokens. Por sesión: 30,000 tokens. Si te acercas al presupuesto, resume y empieza de nuevo. Surfacea el exceso. No lo dejes pasar en silencio.

### Regla 7 — Surfacea conflictos, no los promedies
Si dos patrones existentes contradicen, no los mezcles. Elige uno (el más reciente / más probado), explica por qué, marca el otro para limpieza. El código "promedio" que satisface ambas reglas es el peor código.

### Regla 8 — Lee antes de escribir
Antes de agregar código en un archivo, lee los exports del archivo, el caller inmediato, y utilidades compartidas obvias. Si no entiendes por qué el código existente está estructurado de cierta forma, pregunta antes de agregar.

### Regla 9 — Los tests verifican intención, no solo comportamiento
Cada test debe codificar POR QUÉ el comportamiento importa, no solo QUÉ hace.

### Regla 10 — Checkpoint después de cada paso significativo
Tras completar cada paso en una tarea multi-paso: resume qué se hizo, qué está verificado, qué falta.

### Regla 11 — Respeta las convenciones del codebase, aunque no estés de acuerdo
Conformidad > gusto. Si genuinamente crees que la convención es dañina, súbela. No la forks en silencio.

### Regla 12 — Falla en voz alta
Si no puedes estar seguro de que algo funcionó, dilo explícitamente.
