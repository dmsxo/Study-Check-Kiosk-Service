import { useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import MainLayout from './products/MainLayout';
import Login from './auth/Login';
import QRView from './products/QRView';
import StatView from './products/StatView';
import MyView from './products/MyView';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <Login setIsLoggedIn={setIsLoggedIn} />
            </PublicRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<QRView />} />
          <Route path="stat" element={<StatView />} />
          <Route
            path="mypage"
            element={<MyView setIsLoggedIn={setIsLoggedIn} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
