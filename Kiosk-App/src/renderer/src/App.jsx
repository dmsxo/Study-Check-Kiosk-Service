import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeView from './pages/HomeView';
import KeyChekinView from './pages/KeyCheckinView';
import QRCheckinView from './pages/QRCheckinView';
import GuideView from './pages/guideView';
import { useEffect, useState } from 'react';
import NonConnectionSerialPort from './components/ResultsScreens/NonConnectionSerialPort';

function App() {
  // const [portStatus, setPortStatus] = useState('disconnected');

  // useEffect(() => {
  //   const unsubscribeStatus = window.serialAPI.onPortStatus((status) => {
  //     setPortStatus(status);
  //     if (status === 'disconnected') window.location.href = '/non-connection-serial';
  //     else if (status === 'connected') window.location.href = '/';
  //   });

  //   return () => unsubscribeStatus();
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/qr" element={<QRCheckinView />} />
        <Route path="/key" element={<KeyChekinView />} />
        <Route path="/guide" element={<GuideView />} />
        <Route path="/non-connection-serial" element={<NonConnectionSerialPort />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
