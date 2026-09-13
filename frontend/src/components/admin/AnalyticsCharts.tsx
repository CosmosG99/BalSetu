import React, { useState } from 'react';
import { AnalyticsData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, Activity, Flame, ShieldAlert, Layers } from 'lucide-react';

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  const { isDark } = useTheme();
  const [chartMode, setChartMode] = useState<'frequency' | 'velocity'>('frequency');

  const textColor = isDark ? '#A9BBB6' : '#60736D';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
  const tooltipBg = isDark ? 'rgba(13, 36, 32, 0.95)' : 'rgba(255, 255, 255, 0.98)';
  const tooltipBorder = isDark ? '#1F423B' : '#D0DCD8';

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-[10px] font-bold font-mono"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Standardized Semantic Chart Colors: Coral (Critical/High), Amber (Medium), Teal (Low), Blue (Info)
  const chartPriorityColors = ['#FF654A', '#FF9418', '#F4C95D', '#149B84'];

  // Calculate frequency metrics
  const totalReportsFrequency = data.timelineSeries.reduce((acc, curr) => acc + (curr.reports || 0), 0);
  const totalResolvedFrequency = data.timelineSeries.reduce((acc, curr) => acc + (curr.resolved || 0), 0);
  const peakFrequencyPoint = data.timelineSeries.reduce(
    (max, curr) => (curr.reports > (max?.reports || 0) ? curr : max),
    data.timelineSeries[0]
  );

  // Custom Frequency Tooltip
  const CustomFrequencyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const reports = payload.find((p: any) => p.dataKey === 'reports')?.value || 0;
      const resolved = payload.find((p: any) => p.dataKey === 'resolved')?.value || 0;
      const delta = reports - resolved;
      const rate = reports > 0 ? Math.round((resolved / reports) * 100) : 100;

      return (
        <div
          className="p-3 rounded-xl shadow-xl border text-xs space-y-1.5 backdrop-blur-md"
          style={{ backgroundColor: tooltipBg, borderColor: tooltipBorder }}
        >
          <div className="font-mono font-bold text-charcoal-800 dark:text-ivory-100 flex items-center justify-between border-b border-charcoal-200/40 dark:border-charcoal-700/40 pb-1">
            <span>{label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400">
              {rate}% Velocity
            </span>
          </div>

          <div className="flex items-center justify-between space-x-4 text-[#3B82F6] font-semibold">
            <span>Incoming Reports Frequency:</span>
            <span className="font-mono font-bold">{reports} incidents</span>
          </div>

          <div className="flex items-center justify-between space-x-4 text-[#10B981] font-semibold">
            <span>Resolution Frequency:</span>
            <span className="font-mono font-bold">{resolved} cases</span>
          </div>

          <div className="flex items-center justify-between space-x-4 text-charcoal-500 text-[11px] pt-0.5 border-t border-charcoal-200/40 dark:border-charcoal-700/40">
            <span>Queue Net Delta:</span>
            <span className={`font-mono font-bold ${delta > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {delta > 0 ? `+${delta} pending` : `${delta} resolved`}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Chart 1: Reports & Resolution Velocity Over Time (Frequency Graph) */}
      <div className="natural-panel p-5 rounded-2xl space-y-4 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal-200/80 dark:border-charcoal-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-charcoal-800 dark:text-charcoal-100">
                Reports & Resolution Velocity Over Time
              </h4>
            </div>
            <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-0.5">
              Hourly frequency distribution of incident reports vs ground resolution throughput
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-1 bg-ivory-200/60 dark:bg-charcoal-800 p-1 rounded-xl text-[11px] font-bold self-start sm:self-auto">
            <button
              onClick={() => setChartMode('frequency')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                chartMode === 'frequency'
                  ? 'bg-white dark:bg-charcoal-900 text-teal-700 dark:text-teal-400 shadow-xs'
                  : 'text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Frequency Bars</span>
            </button>

            <button
              onClick={() => setChartMode('velocity')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                chartMode === 'velocity'
                  ? 'bg-white dark:bg-charcoal-900 text-teal-700 dark:text-teal-400 shadow-xs'
                  : 'text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Velocity Flow</span>
            </button>
          </div>
        </div>

        {/* Quick Frequency KPI Snippet */}
        <div className="grid grid-cols-3 gap-2 py-1 px-3 rounded-xl bg-ivory-100/60 dark:bg-forest-900/40 border border-charcoal-200/40 dark:border-charcoal-800/40 text-[11px]">
          <div>
            <span className="text-charcoal-500 text-[10px] uppercase font-bold block">Total Frequency</span>
            <span className="font-mono font-bold text-charcoal-800 dark:text-ivory-100">{totalReportsFrequency} Intake</span>
          </div>
          <div>
            <span className="text-charcoal-500 text-[10px] uppercase font-bold block">Resolved Throughput</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{totalResolvedFrequency} Closed</span>
          </div>
          <div>
            <span className="text-charcoal-500 text-[10px] uppercase font-bold block">Peak Window</span>
            <span className="font-mono font-bold text-teal-700 dark:text-teal-400">{peakFrequencyPoint?.time?.split(' - ')?.[0] || '16:00'} ({peakFrequencyPoint?.reports || 0}/hr)</span>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'frequency' ? (
              <BarChart data={data.timelineSeries} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="time" stroke={textColor} fontSize={10} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip content={<CustomFrequencyTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-[11px] text-charcoal-700 dark:text-charcoal-300 font-semibold">{value}</span>
                  )}
                />
                <Bar
                  dataKey="reports"
                  name="Reports Intake Frequency"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="resolved"
                  name="Resolution Frequency"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            ) : (
              <AreaChart data={data.timelineSeries}>
                <defs>
                  <linearGradient id="colorReportsFreq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolvedFreq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="time" stroke={textColor} fontSize={10} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip content={<CustomFrequencyTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-[11px] text-charcoal-700 dark:text-charcoal-300 font-semibold">{value}</span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="reports"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorReportsFreq)"
                  name="Reports Intake Velocity"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorResolvedFreq)"
                  name="Case Resolution Velocity"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Priority Distribution */}
      <div className="natural-panel p-5 rounded-2xl space-y-4 shadow-card">
        <div className="flex items-center justify-between border-b border-charcoal-200/80 dark:border-charcoal-800 pb-3">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-accentCoral" />
            <h4 className="text-xs font-black uppercase tracking-wider text-charcoal-800 dark:text-charcoal-100">
              Priority Risk Level Distribution
            </h4>
          </div>
          <span className="text-[10px] text-charcoal-500 font-mono">Triage Share</span>
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
                fill="#149B84"
                dataKey="count"
                nameKey="priority"
              >
                {data.priorityDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={chartPriorityColors[index % chartPriorityColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: '12px',
                  color: isDark ? '#fff' : '#000',
                  fontSize: '12px'
                }}
              />
              <Legend formatter={(value) => <span className="text-xs text-charcoal-800 dark:text-charcoal-300 font-semibold">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Incident Categories */}
      <div className="natural-panel p-5 rounded-2xl space-y-4 shadow-card">
        <div className="flex items-center justify-between border-b border-charcoal-200/80 dark:border-charcoal-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-brand-purple" />
            <h4 className="text-xs font-black uppercase tracking-wider text-charcoal-800 dark:text-charcoal-100">
              Cases by Incident Category
            </h4>
          </div>
          <span className="text-[10px] text-charcoal-500 font-mono">Classification Breakdown</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.casesByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="category" stroke={textColor} fontSize={10} tickLine={false} />
              <YAxis stroke={textColor} fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: '12px',
                  color: isDark ? '#fff' : '#000',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" fill="#8B4DE8" radius={[6, 6, 0, 0]} name="Report Count (Purple)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Transit Hub Distribution */}
      <div className="natural-panel p-5 rounded-2xl space-y-4 shadow-card">
        <div className="flex items-center justify-between border-b border-charcoal-200/80 dark:border-charcoal-800 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h4 className="text-xs font-black uppercase tracking-wider text-charcoal-800 dark:text-charcoal-100">
              High-Density Transit Hubs
            </h4>
          </div>
          <span className="text-[10px] text-charcoal-500 font-mono">Location Volume</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.casesByLocation} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis type="number" stroke={textColor} fontSize={11} tickLine={false} />
              <YAxis type="category" dataKey="location" stroke={textColor} fontSize={10} width={130} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: '12px',
                  color: isDark ? '#fff' : '#000',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" fill="#42C7D9" radius={[0, 6, 6, 0]} name="Incident Count (Cyan)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
