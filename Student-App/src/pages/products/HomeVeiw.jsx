// Home.jsx
import { useState, useEffect } from 'react';
import QRView from './HomePages/QRView';
import StudyView from './HomePages/StudyView';
import { getStatus } from '../../api/AttendanceAPI';

function Home({ getAuthCode, code, statData }) {
  const [isStudying, setIsStudying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getStatus('night');
      setIsStudying(status);
      setLoading(false);
    };
    fetchStatus();
  }, []);

  if (loading) {
    return <></>;
  } else if (isStudying) {
    // console.log(isStudying);
    return <StudyView setIsStudying={setIsStudying} />;
  } else {
    // console.log(isStudying);
    return <QRView code={code} getAuthCode={getAuthCode} />;
  }
}

export default Home;
