// Home.jsx
import { useState, useEffect } from 'react';
import QRView from './HomePages/QRView';
import StudyView from './HomePages/StudyView';
import { getStatus } from '../../api/AttendanceAPI';
import { getFullStatData } from '../../helpers/stats.helper';

function Home({ getAuthCode, code, statData, setStatData }) {
  const [isStudying, setIsStudying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getStatus('night');
      setIsStudying(status);
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    getFullStatData().then((res) => {
      console.log('Update!');
      setStatData(res);
      setLoading(false);
    });
  }, [isStudying]);

  if (loading) {
    return <></>;
  } else if (isStudying) {
    // console.log(isStudying);
    return <StudyView setIsStudying={setIsStudying} statData={statData} />;
  } else {
    // console.log(isStudying);
    return <QRView code={code} getAuthCode={getAuthCode} />;
  }
}

export default Home;
