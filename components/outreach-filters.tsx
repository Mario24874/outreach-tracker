'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type Props = {
  industries: string[]
  countries: string[]
}

export function OutreachFilters({ industries, countries }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const set = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`/outreach?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <Label className="text-xs text-slate-400">Búsqueda</Label>
        <Input
          placeholder="Empresa o email..."
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => {
            const v = e.target.value
            const params = new URLSearchParams(searchParams.toString())
            if (v) params.set('q', v)
            else params.delete('q')
            params.delete('page')
            router.push(`/outreach?${params.toString()}`)
          }}
          className="w-52 h-9 bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-slate-400">Industria</Label>
        <Select
          defaultValue={searchParams.get('industry') ?? 'all'}
          onValueChange={(v) => set('industry', v ?? 'all')}
        >
          <SelectTrigger className="w-44 h-9 bg-slate-800 border-slate-600 text-slate-200 text-sm">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-slate-200">Todas</SelectItem>
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind} className="text-slate-200">
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-slate-400">País</Label>
        <Select
          defaultValue={searchParams.get('country') ?? 'all'}
          onValueChange={(v) => set('country', v ?? 'all')}
        >
          <SelectTrigger className="w-44 h-9 bg-slate-800 border-slate-600 text-slate-200 text-sm">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-slate-200">Todos</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c} className="text-slate-200">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-slate-400">Estado</Label>
        <Select
          defaultValue={searchParams.get('status') ?? 'all'}
          onValueChange={(v) => set('status', v ?? 'all')}
        >
          <SelectTrigger className="w-36 h-9 bg-slate-800 border-slate-600 text-slate-200 text-sm">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-slate-200">Todos</SelectItem>
            <SelectItem value="sent" className="text-slate-200">Enviado</SelectItem>
            <SelectItem value="error" className="text-slate-200">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-slate-400">Desde</Label>
        <Input
          type="date"
          defaultValue={searchParams.get('from') ?? ''}
          onChange={(e) => set('from', e.target.value)}
          className="w-40 h-9 bg-slate-800 border-slate-600 text-slate-200 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-slate-400">Hasta</Label>
        <Input
          type="date"
          defaultValue={searchParams.get('to') ?? ''}
          onChange={(e) => set('to', e.target.value)}
          className="w-40 h-9 bg-slate-800 border-slate-600 text-slate-200 text-sm"
        />
      </div>
    </div>
  )
}
