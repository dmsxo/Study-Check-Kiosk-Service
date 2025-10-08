import { useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { CalendarCheck, ChartLine, UserRound } from 'lucide-react';
import QRView from './products/QRView';
import StatView from './products/StatView';
import MyView from './products/MyView';
import Login from './auth/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex flex-col h-svh">
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<QRView />} />
          <Route path="/stat" element={<StatView />} />
          <Route path="/mypage" element={<MyView />} />
        </Routes>
      </main>

      <nav className="shrink-0 border-t-2 border-gray-200">
        <div className="grid h-full grid-cols-3">
          <Link to="/" className="flex flex-col items-center py-2">
            <CalendarCheck className="mb-1 text-gray-500" />
            <span className="text-xs text-gray-500">출석 체크</span>
          </Link>
          <Link to="/stat" className="flex flex-col items-center py-2">
            <ChartLine className="mb-1 text-gray-500" />
            <span className="text-xs text-gray-500">출석 현황</span>
          </Link>
          <Link to="/mypage" className="flex flex-col items-center py-2">
            <UserRound className="mb-1 text-gray-500" />
            <span className="text-xs text-gray-500">나의 정보</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default App;
