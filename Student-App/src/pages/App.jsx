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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [code, setCode] = useState('');
  // 아침 독서, 야간 자율학습 출석 통계 객체
  const [statData, setStatData] = useState();
  const user = userData;

  const getAuthCode = async () => {
    const code = await getCode();
    setCode(code);
  };

  useEffect(() => {
    getFullStatData().then((res) => setStatData(res));
  }, []);

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
            element={
              <Home code={code} getAuthCode={getAuthCode} statData={statData} />
            }
          />
          <Route path="/key" element={<KeyInputView />} />
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
