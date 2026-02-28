'use client';

import { useEffect, useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { TradeOff } from '@/data/system-details';

interface TradeoffRadarProps {
  tradeoffs: TradeOff;
  systemName: string;
}

export function TradeoffRadar({ tradeoffs, systemName }: TradeoffRadarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = [
    { subject: 'Scalability', value: tradeoffs.scalability, fullMark: 10 },
    { subject: 'Availability', value: tradeoffs.availability, fullMark: 10 },
    { subject: 'Consistency', value: tradeoffs.consistency, fullMark: 10 },
    { subject: 'Latency', value: tradeoffs.latency, fullMark: 10 },
    { subject: 'Durability', value: tradeoffs.durability, fullMark: 10 },
    { subject: 'Simplicity', value: tradeoffs.simplicity, fullMark: 10 },
  ];

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text)' }}>
        Trade-off Profile
      </h3>
      <div className="w-full h-[350px]" style={{ minHeight: '350px' }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-geist-mono)' }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 10]}
                tick={{ fill: 'var(--muted)', fontSize: 10 }}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '13px',
                }}
              />
              <Radar
                name={systemName}
                dataKey="value"
                stroke="var(--accent)"
                fill="var(--accent)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        {data.map((d) => (
          <div
            key={d.subject}
            className="text-center p-2 rounded-lg"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
              {d.subject}
            </p>
            <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
              {d.value}/10
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}