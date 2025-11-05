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
import { userData } from '../test/userData';
import { getAttendances, getCode } from '../api/AttendanceAPI';
import StudyView from './products/HomePages/StudyView';
import { getFullStatData } from '../helpers/stats.helper';
import Home from './products/HomeVeiw';
import CheckoutModal from '../components/HomeComponenets/CheckoutModal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 아침 독서, 야간 자율학습 출석 통계 객체
  const [statData, setStatData] = useState();
  const user = userData;

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
          <Route
            index
            element={<Home statData={statData} setStatData={setStatData} />}
          />
          <Route path="/key" element={<KeyInputView />} />
          <Route path="/checkout" element={<CheckoutModal />} />
          <Route path="stat" element={<StatView statData={statData} />} />
          <Route
            path="mypage"
            element={<MyView setIsLoggedIn={setIsLoggedIn} user={user} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
