import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeView from './pages/HomeView';
import KeyChekinView from './pages/KeyCheckinView';
import QRCheckinView from './pages/QRCheckinView';
import GuideView from './pages/guideView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/qr" element={<QRCheckinView />} />
        <Route path="/key" element={<KeyChekinView />} />
        <Route path="/guide" element={<GuideView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
