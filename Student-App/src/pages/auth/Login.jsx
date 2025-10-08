import React from 'react';

function Login({ setIsLoggedIn }) {
  return (
    <div className="flex flex-col justify-center items-center h-svh bg-gray-50">
      <button
        onClick={() => {
          setIsLoggedIn(true);
        }}
        className="p-4 rounded-2xl border border-slate-200"
      >
        로그인
      </button>
    </div>
  );
}

export default Login;
