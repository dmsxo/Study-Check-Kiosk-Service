import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import FinalPopupModal from './FinalPopupModal';
import { useNavigate } from 'react-router-dom';
import { check_out } from '../../api/AttendanceAPI';
import { useAttendance } from '../../hooks/useAttendance';

export default function CheckoutModal() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const navigate = useNavigate();

  const { refresh } = useAttendance();

  const handleSubmit = () => {
    setShowConfirm(true);
  };

  const handleFinalCheckout = () => {
    console.log('체크아웃 메시지:', message);
    setIsCheckedOut(true);
    setShowConfirm(false);

    setTimeout(() => {
      check_out('night', message).then(() => {
        refresh().then(() => {
          navigate('/', { replace: true });
        });
      });
    }, 3000);
  };

  const handleCancel = () => {
    if (showConfirm) {
      setShowConfirm(false);
    } else {
      navigate('/');
    }
  };

  const placeholderExamples = [
    'ex) 오늘 집중이 잘 됐어요! 💪',
    'ex) 가족 약속이 있어서 일찍 나가요',
    'ex) 학원에 가야해서 일찍 나가요',
    'ex) 조금 피곤하지만 보람찬 하루였어요',
    'ex) 내일 더 열심히 하겠습니다!',
    'ex) 오늘은 여기까지!',
  ];

  const randomPlaceholder =
    placeholderExamples[Math.floor(Math.random() * placeholderExamples.length)];

  return (
    <>
      {!isCheckedOut && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="min-h-screen flex flex-col">
            {/* 헤더 */}
            <div className="px-4 py-4 flex items-center">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 flex flex-col px-6 pt-8 pb-8">
              <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                    자율학습 마무리
                  </h3>
                  <p className="text-gray-500 text-lg">오늘 하루는 어땠나요?</p>
                </div>

                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={randomPlaceholder}
                    maxLength={200}
                    rows={6}
                    className="w-full px-0 py-0 border-0 focus:outline-none focus:ring-0 resize-none text-gray-700 placeholder-gray-400 text-lg"
                  />
                </div>

                <div className="text-right mb-4">
                  <p className="text-sm text-gray-400">{message.length}/200</p>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-lg"
                >
                  체크아웃하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showConfirm && (
        <FinalPopupModal
          handleCancel={handleCancel}
          handleFinalCheckout={handleFinalCheckout}
          message={message}
        />
      )}
      {isCheckedOut && (
        <div className="flex justify-center items-center fixed inset-0 bg-white z-50 overflow-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👋</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              수고하셨어요!
            </h2>
            <p className="text-gray-600">오늘도 좋은 하루 보내세요</p>
          </div>
        </div>
      )}
    </>
  );
}
