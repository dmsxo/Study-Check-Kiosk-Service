import { createContext, useContext, useState, useEffect } from 'react';
import {
  checkSession,
  logout_session,
  login_session,
} from '../api/AttendanceAPI';
import api from '../api/Instance';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export async function waitForCookie(maxWaitMs = 3000, intervalMs = 200) {
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    try {
      await api.get('/auth/me'); // 쿠키 붙으면 성공함
      // 성공 → 서버가 쿠키 인식 → 세션 존재 → 끝!
      return true;
    } catch (err) {
      // 아직 쿠키 안 붙음 → 조금 더 기다림
      await new Promise((res) => setTimeout(res, intervalMs));
    }
  }

  return false; // 제한 시간 넘김
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);
  const [profileURL, setProfileURL] = useState(null);
  const navigate = useNavigate();

  const refetchUser = async () => {
    try {
      const res = await checkSession();
      setUser(res);
      const profile = res.profileImageFilename;
      console.log(profile);
      if (profile && profile != 'null') {
        const preSignedURL = await api.get(`/images/presigned/${profile}`);
        setProfileURL(preSignedURL.data.url);
      } else setProfileURL(null);
      setIsLoggedIn(true);
      return res;
    } catch (e) {
      setUser(null);
      setProfileURL(null);
      setIsLoggedIn(false);
      return null;
    }
  };

  // 앱 첫 로드
  useEffect(() => {
    refetchUser();
  }, []);

  const login = async (email) => {
    const res = await login_session(email);
    setIsLoggedIn(true);
    setUser(res);

    await waitForCookie();

    await refetchUser();
    navigate('/', { replace: true });
  };

  const logout = async () => {
    await logout_session();
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        profileURL,
        login,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
