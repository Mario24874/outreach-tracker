'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { ChartIndustry } from '@/lib/types'

const COLORS = ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b', '#f43f5e', '#a78bfa']

type Props = {
  data: ChartIndustry[]
}

export function EmailsByIndustryChart({ data }: Props) {
  return (
    <div style={{
      background: '#0f172a', border: '1px solid #1e293b',
      borderRadius: 14, padding: 20, height: '100%',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Por industria
        </h3>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94a3b8' }}>Últimos 30 días</p>
      </div>
      {data.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, color: '#475569', fontSize: 13 }}>
          Sin datos
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#020617',
                border: '1px solid #334155',
                borderRadius: 8,
                color: '#f8fafc',
                fontSize: 13,
              }}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#94a3b8', fontSize: 11 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
