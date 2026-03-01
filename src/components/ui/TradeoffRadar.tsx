'use client';

import type { ReactNode } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { TradeOff } from '@/data/system-details/index';
import { useMounted } from '@/lib/useMounted';

interface TradeoffRadarProps {
  tradeoffs: TradeOff;
  systemName: string;
}

export function TradeoffRadar({ tradeoffs, systemName }: TradeoffRadarProps) {
  const mounted = useMounted();

  const dimensionDescriptions: Record<string, string> = {
    Scalability: 'Ability to handle growing load by adding resources',
    Availability: 'Percentage of time the system remains operational',
    Consistency: 'All nodes see the same data at the same time',
    Latency: 'Speed of individual request processing',
    Durability: 'Guarantee that stored data is not lost',
    Simplicity: 'Ease of understanding and maintaining the system',
  };

  const data = [
    { subject: 'Scalability', value: tradeoffs.scalability, fullMark: 10, description: dimensionDescriptions['Scalability'] },
    { subject: 'Availability', value: tradeoffs.availability, fullMark: 10, description: dimensionDescriptions['Availability'] },
    { subject: 'Consistency', value: tradeoffs.consistency, fullMark: 10, description: dimensionDescriptions['Consistency'] },
    { subject: 'Latency', value: tradeoffs.latency, fullMark: 10, description: dimensionDescriptions['Latency'] },
    { subject: 'Durability', value: tradeoffs.durability, fullMark: 10, description: dimensionDescriptions['Durability'] },
    { subject: 'Simplicity', value: tradeoffs.simplicity, fullMark: 10, description: dimensionDescriptions['Simplicity'] },
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
      <div className="w-full h-[300px] sm:h-[350px] lg:h-[400px]" style={{ minHeight: '280px' }}>
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
                  maxWidth: '220px',
                }}
                formatter={(value, name, item): [ReactNode, string] => {
                  const score = typeof value === 'number' ? value : Number(value ?? 0);
                  const desc = (item?.payload as { description?: string } | undefined)?.description;
                  return [
                    <span key="v">
                      <strong>{score}/10</strong>
                      {desc && <span style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{desc}</span>}
                    </span>,
                    String(name)
                  ];
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
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