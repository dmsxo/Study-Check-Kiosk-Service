import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './products/MainLayout';
import Login from './auth/Login';
import QRView from './products/HomePages/QRView';
import StatView from './products/StatView';
import MyView from './products/MyView';
import KeyInputView from './products/KeyInputView';
import ProtectedRoute from '../routes/ProtectedRoute';
import PublicRoute from '../routes/PublicRoute';
import Home from './products/HomeVeiw';
import CheckoutModal from '../components/HomeComponenets/CheckoutModal';
import { AuthProvider } from '../contexts/AuthContext';
import ServerNotConnected from './products/ServerNotConnected';
import LoginViewForEventsOnly from './auth/LoginViewForEventsOnly';
import ApplicationView from './products/ApplicationView';
import { getCurrentPeriodId } from '../helpers/application.helper';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginViewForEventsOnly />
              </PublicRoute>
            }
          />
          <Route
            path="/server-not-connected"
            element={<ServerNotConnected />}
          />
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="/key" element={<KeyInputView />} />
            <Route path="/checkout" element={<CheckoutModal />} />
            <Route path="/stat" element={<StatView />} />
            <Route path="/application" element={<ApplicationView />} />
            <Route path="/mypage" element={<MyView />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
