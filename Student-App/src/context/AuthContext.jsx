import { createContext, useContext, useState, useEffect } from "react";
import {
  checkSession,
  logout_session,
  login_session,
} from "../api/AttendanceAPI"; // 서버 API
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null: 로딩 상태
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession()
      .then((res) => {
        setIsLoggedIn(true);
        setUser(res); // 필요하다면 유저 정보 저장
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      });
  }, []);

  const login = async (email) => {
    return await login_session(email).then((res) => {
      setIsLoggedIn(true);
      setUser(res);
      navigate("/", { replace: true }); // 로그인 후 홈으로
    });
  };

  const logout = async () => {
    return await logout_session().then(() => {
      setIsLoggedIn(false);
      setUser(null);
      navigate("/login", { replace: true });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 컨텍스트 사용을 쉽게 해주는 훅
export function useAuth() {
  return useContext(AuthContext);
}
