import { useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { CalendarCheck, ChartLine, UserRound } from "lucide-react";
import QRView from "./routes/QRView";
import StatView from "./routes/StatView";
import MyView from "./routes/MyView";
import Login from "./routes/Login";

function App() {
  return (
    <div className="flex flex-col h-svh">
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<QRView />} />
          <Route path="/stat" element={<StatView />} />
          <Route path="/mypage" element={<MyView />} />
          {/* <Route path="/login" element={<Login />} /> */}
        </Routes>
      </main>

      <nav className="shrink-0 border-t-2 border-slate-200">
        <div className="grid h-full grid-cols-3">
          <Link to="/" className="flex flex-col items-center py-2">
            <CalendarCheck className="mb-1" />
            <span className="text-xs">출석 체크</span>
          </Link>
          <Link to="/stat" className="flex flex-col items-center py-2">
            <ChartLine className="mb-1" />
            <span className="text-xs">출석 현황</span>
          </Link>
          <Link to="/mypage" className="flex flex-col items-center py-2">
            <UserRound className="mb-1" />
            <span className="text-xs">나의 정보</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default App;
