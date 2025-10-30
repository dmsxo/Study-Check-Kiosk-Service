import { useState } from 'react';

function KeyChekinView() {
  const [state, setState] = useState('waiting');

  return (
    <>
      <h3>아래 키를 입력하세요</h3>
      <h1>ABC123</h1>
    </>
  );
}

export default KeyChekinView;
