'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

type Props = {
  data: { date: string; count: number }[]
}

export function VisitsByDayChart({ data }: Props) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 14, padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Visitas por día
        </h3>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94a3b8' }}>Últimos 14 días</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#f8fafc', fontSize: 13 }}
            labelStyle={{ color: '#94a3b8' }}
            cursor={{ fill: 'rgba(16,185,129,0.08)' }}
          />
          <Bar dataKey="count" name="Visitas" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
