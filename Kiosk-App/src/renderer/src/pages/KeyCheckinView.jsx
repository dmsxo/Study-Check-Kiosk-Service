import { useEffect, useState } from 'react';
import { getCode, getUser, ping } from '../../api/AttendanceAPI';
import { Clock } from 'lucide-react';
import CheckinComplete from '../components/ResultsScreens/CheckInComplete';
import TimeOut from '../components/ResultsScreens/TimeOut';
import HomeButton from '../components/UI/HomeButton';

function KeyChekinView() {
  const [key, setKey] = useState('');
  const [state, setState] = useState('waiting');
  const [remain, setRemain] = useState();
  const [issuer, setIssuer] = useState('');

  useEffect(() => {
    if (state === 'waiting') {
      //키 발급
      const run = async () => {
        const code = await getCode();
        setKey(code);
      };
      run();
      //타이머 시작
      setRemain(15);
      const timer = setInterval(() => {
        setRemain((prev) => {
          if (prev === 0) {
            setState('timeout');
          } else return prev - 1;
        });

        ping().then((res) => {
          console.log(res);
          if (res) {
            getUser(res).then((user) => {
              console.log(user);
                setIssuer(user.name);
                setState('success');
              });
            }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state]);

  const renderContent = () => {
    switch (state) {
      case 'waiting':
        return (
          <div className="space-y-5 text-center">
            <h3 className="text-3xl font-bold">아래 키를 앱에 입력하세요</h3>
            <h1 className="text-6xl font-mono text-blue-600">{key}</h1>
            <h6 className="flex justify-center items-center gap-2">
              <p>키 만료까지 남은 시간</p>
              <Clock size={20} className="inline-block" />
              <p>{remain}s</p>
            </h6>
          </div>
        );
      case 'success':
        return <CheckinComplete issuer={issuer} />;
      case 'timeout':
        return <TimeOut onClick={() => setState('waiting')} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-8">
      {renderContent()}

      {(!remain || remain <= 5) && <HomeButton />}
    </div>
  );
}

export default KeyChekinView;
