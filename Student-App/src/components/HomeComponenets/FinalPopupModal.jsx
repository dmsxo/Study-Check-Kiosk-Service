import { AlertCircle } from 'lucide-react';

export default function FinalPopupModal({ handleCancel, handleFinalCheckout }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
          정말 체크아웃 하시겠어요?
        </h3>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-center font-medium">
            ⚠️ 오늘은 다시 출석할 수 없어요
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            취소
          </button>
          <button
            onClick={handleFinalCheckout}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            체크아웃
          </button>
        </div>
      </div>
    </div>
  );
}
