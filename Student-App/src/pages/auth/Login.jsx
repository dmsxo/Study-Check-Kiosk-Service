import React from 'react';

function Login({ setIsLoggedIn }) {
  return (
    <>
      <h1>로그인</h1>
      <button
        onClick={() => {
          setIsLoggedIn(true);
        }}
      >
        로그인 버튼임
      </button>
    </>
  );
}

export default Login;
