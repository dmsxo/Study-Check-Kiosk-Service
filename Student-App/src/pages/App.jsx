import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './products/MainLayout';
import Login from './auth/Login';
import QRView from './products/QRView';
import StatView from './products/StatView';
import MyView from './products/MyView';
import KeyInputView from './products/KeyInputView';
import ProtectedRoute from '../routes/ProtectedRoute';
import PublicRoute from '../routes/PublicRoute';
import { userData } from '../test/userData';
import { getCode } from '../api/checkin';
import StudyView from './products/StudyView';
import { getFullStatData } from '../helpers/stats.helper';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [code, setCode] = useState('');
  const user = userData;

  // 아침 독서, 야간 자율학습 출석 통계 객체
  const statData = getFullStatData();

  const getAuthCode = async () => {
    const code = await getCode();
    setCode(code);
  };

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
            element={<QRView code={code} getAuthCode={getAuthCode} />}
          />
          <Route path="key" element={<KeyInputView />} />
          <Route path="study" element={<StudyView statData={statData} />} />
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
