import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

interface HighlightDonutChartProps {
  wins: number;
  losses: number;
}

const HighlightDonutChart: React.FC<HighlightDonutChartProps> = ({ wins, losses }) => {
  return (
    <PieChart
      className="max-h-64"
      label={({ x, y, dx, dy, dataEntry }) => (
        <g x={x} y={y} dx={dx} dy={dy}>
          <text x={x} y={y} dx={dx} dy={dy} dominantBaseline="central" textAnchor="middle" className="text-sm fill-slate-200">
            {dataEntry.value}
          </text>
          <text x={x} y={y + 10} dx={dx} dy={dy} dominantBaseline="central" textAnchor="middle" style={{ fontSize: 5 }} className="fill-slate-300">
            {dataEntry.title}
          </text>
        </g>
      )}
      data={[
        { title: 'Wins', value: wins, color: '#059669' },
        { title: 'Losses', value: losses, color: '#dc2626' },
      ]}
      lineWidth={15}
      rounded
    />
  );
};

export default HighlightDonutChart;
