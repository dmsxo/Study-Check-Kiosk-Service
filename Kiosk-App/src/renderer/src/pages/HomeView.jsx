import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomeView() {
  return (
    <div className="h-screen flex items-center justify-center gap-4">
      <Link to={'/QR'} className="border border-slate-200 rounded-2xl p-4">
        QR로 체크인
      </Link>
      <Link to={'/Key'} className="border border-slate-200 rounded-2xl p-4">
        발급 키로 체크인
      </Link>
    </div>
  );
}

export default HomeView;
