import { useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import QRView from "./routes/QRView";
import StatView from "./routes/StatView";
import MyView from "./routes/MyView";

function App() {
  return (
    <>
      <div className="flexed">
        <Routes>
          <Route path="/" element={<QRView />} />
          <Route path="/stat" element={<StatView />} />
          <Route path="/mypage" element={<MyView />} />
        </Routes>
      </div>

      <nav className="fixed bottom-0 w-full h-16 bg-white border-t">
        <div className="flex h-full">
          <Link to="/" className="h-full flex-auto">
            <button className="h-full w-full">QR</button>
          </Link>
          <Link to="/stat" className="h-full flex-auto">
            <button className="h-full w-full">Stat</button>
          </Link>
          <Link to="/mypage" className="h-full flex-auto">
            <button className="h-full w-full">My</button>
          </Link>
        </div>
      </nav>
    </>
  );
}

export default App;
