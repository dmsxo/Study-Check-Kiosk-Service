import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeView from './pages/HomeView';
import KeyChekinView from './pages/KeyCheckinView';
import QRCheckinView from './pages/QRCheckinView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/QR" element={<QRCheckinView />} />
        <Route path="/Key" element={<KeyChekinView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
