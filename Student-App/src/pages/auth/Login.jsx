import React, { useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function Login() {
  const text = useRef();
  const { login } = useAuth();

  return (
    <div className="flex justify-center items-center h-svh bg-gray-50 gap-x-2">
      <input
        type="text"
        placeholder="이메일"
        ref={text}
        className="border border-slate-200 rounded-2xl p-4 w-3xs"
      />
      <button
        onClick={() => {
          console.log('Logging in with email:', text.current.value);
          login(text.current.value);
        }}
        className="p-4 rounded-2xl bg-gray-800 text-white"
      >
        로그인
      </button>
    </div>
  );
}

export default Login;
