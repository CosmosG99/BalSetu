import React from 'react';
import { AnalyticsData } from '../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-bold font-mono">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Chart 1: Reports Volume Over Time */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Reports & Resolution Velocity Over Time
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">Hourly Series</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.timelineSeries}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="reports" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorReports)" name="Total Reports" />
              <Area type="monotone" dataKey="resolved" stroke="#10B981" fillOpacity={1} fill="url(#colorResolved)" name="Resolved Cases" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Priority Distribution */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Priority Risk Level Distribution
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">Triage Share</span>
        </div>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.priorityDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={85}
                fill="#8884d8"
                dataKey="count"
                nameKey="priority"
              >
                {data.priorityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Legend formatter={(value) => <span className="text-xs text-slate-300 font-semibold">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Incident Categories */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Cases by Incident Category
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">Classification Breakdown</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.casesByCategory}>
              <XAxis dataKey="category" stroke="#64748B" fontSize={10} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#D946EF" radius={[6, 6, 0, 0]} name="Report Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Transit Hub Distribution */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            High-Density Transit Hubs
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">Location Volume</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.casesByLocation} layout="vertical">
              <XAxis type="number" stroke="#64748B" fontSize={11} />
              <YAxis type="category" dataKey="location" stroke="#64748B" fontSize={10} width={130} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} name="Incident Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
