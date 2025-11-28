// Home.jsx
import { useState, useEffect } from 'react';
import QRView from './HomePages/QRView';
import StudyView from './HomePages/StudyView';
import { getStatus, getCode } from '../../api/AttendanceAPI';
import { useAuth } from '../../contexts/AuthContext';

function Home() {
  const [code, setCode] = useState('');
  const [isStudying, setIsStudying] = useState(false);

  const { user } = useAuth();

  console.log(user);

  const getAuthCode = async () => {
    const code = await getCode(user.studentId);
    setCode(code);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getStatus();
      setIsStudying(status ? status.isStudy : false);
    };
    fetchStatus();
  }, []);

  if (isStudying) {
    // console.log(isStudying);
    return <StudyView />;
  } else {
    // console.log(isStudying);
    // return <CheckoutModal />;
    return <QRView code={code} getAuthCode={getAuthCode} user={user} />;
  }
}

export default Home;
