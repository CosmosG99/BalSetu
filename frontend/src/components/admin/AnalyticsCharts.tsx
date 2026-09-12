import React from 'react';
import { AnalyticsData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
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
  const { isDark } = useTheme();

  const textColor = isDark ? '#A3B3A9' : '#4E5A54';
  const tooltipBg = isDark ? '#162420' : '#FFFFFF';
  const tooltipBorder = isDark ? '#263832' : '#E8E5DC';
  const tooltipText = isDark ? '#F5F3ED' : '#1A2923';

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
      <div className="natural-panel p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-ivory-300 dark:border-charcoal-800 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-ivory-100">
            Reports & Resolution Velocity Over Time
          </h4>
          <span className="text-[10px] text-charcoal-500 dark:text-ivory-400 font-mono">Hourly Series</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.timelineSeries}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#173C32" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#173C32" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6F8F7A" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6F8F7A" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke={textColor} fontSize={11} />
              <YAxis stroke={textColor} fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', color: tooltipText, fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="reports" stroke="#173C32" fillOpacity={1} fill="url(#colorReports)" name="Total Reports" />
              <Area type="monotone" dataKey="resolved" stroke="#6F8F7A" fillOpacity={1} fill="url(#colorResolved)" name="Resolved Cases" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Priority Distribution */}
      <div className="natural-panel p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-ivory-300 dark:border-charcoal-800 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-ivory-100">
            Priority Risk Level Distribution
          </h4>
          <span className="text-[10px] text-charcoal-500 dark:text-ivory-400 font-mono">Triage Share</span>
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
                fill="#6F8F7A"
                dataKey="count"
                nameKey="priority"
              >
                {data.priorityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', color: tooltipText, fontSize: '12px' }} />
              <Legend formatter={(value) => <span className="text-xs text-charcoal-700 dark:text-ivory-300 font-semibold">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Incident Categories */}
      <div className="natural-panel p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-ivory-300 dark:border-charcoal-800 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-ivory-100">
            Cases by Incident Category
          </h4>
          <span className="text-[10px] text-charcoal-500 dark:text-ivory-400 font-mono">Classification Breakdown</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.casesByCategory}>
              <XAxis dataKey="category" stroke={textColor} fontSize={10} />
              <YAxis stroke={textColor} fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', color: tooltipText, fontSize: '12px' }} />
              <Bar dataKey="count" fill="#C97955" radius={[6, 6, 0, 0]} name="Report Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Transit Hub Distribution */}
      <div className="natural-panel p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-ivory-300 dark:border-charcoal-800 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-ivory-100">
            High-Density Transit Hubs
          </h4>
          <span className="text-[10px] text-charcoal-500 dark:text-ivory-400 font-mono">Location Volume</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.casesByLocation} layout="vertical">
              <XAxis type="number" stroke={textColor} fontSize={11} />
              <YAxis type="category" dataKey="location" stroke={textColor} fontSize={10} width={130} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', color: tooltipText, fontSize: '12px' }} />
              <Bar dataKey="count" fill="#173C32" radius={[0, 6, 6, 0]} name="Incident Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
