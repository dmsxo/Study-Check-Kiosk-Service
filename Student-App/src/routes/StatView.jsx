import React from 'react';
import { ChartLine } from 'lucide-react';
import { useState, useMemo } from 'react';
import {
  Calendar,
  Flame,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

function StatView() {
  return (
    <div className="h-full min-w-fit p-4 space-y-3">
      <h1 className="font-black text-xl mb-4">출석 현황</h1>
    </div>
  );
}

export default StatView;
