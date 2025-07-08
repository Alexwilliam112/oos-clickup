`use client`

import React from 'react';
import PieChartPage from '../chart/pieChart';
import BarChartPage from '../chart/barChart';
import StackedBarChartPage from '../chart/stackedBarChart';
import RadarChartPage from '../chart/radarChart';
import TableRankingPage from '../chart/tableRanking';

export function ChartPage() {

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4'>
        <div className="w-full max-w-[50vw]">
            <PieChartPage />
        </div>
        <div className="w-full max-w-[50vw]">
            <BarChartPage />
        </div>
        <div className="w-full max-w-[50vw]">
            <RadarChartPage />
        </div>
        <div className="w-full max-w-[50vw]">
            <StackedBarChartPage />
        </div>
        <div className="w-full col-span-1 md:col-span-2 xl:col-span-2">
            <TableRankingPage />
        </div>
    </div>
  );
}
