import { createContext, useContext, useState, useEffect } from 'react';
import {
  checkSession,
  logout_session,
  login_session,
} from '../api/AttendanceAPI';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const refetchUser = async () => {
    try {
      const res = await checkSession();
      setUser(res);
      setIsLoggedIn(true);
      return res;
    } catch (e) {
      setUser(null);
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
    await refetchUser();
    navigate('/', { replace: true });
  };

  const logout = async () => {
    await logout_session();
    setIsLoggedIn(false);
    setUser(null);
    await refetchUser();
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
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
