export default function RetryButton({ onClick }) {
  return (
    <button
      className="px-12 py-5 bg-black text-white text-xl font-bold rounded-3xl hover:bg-gray-800 transition-all duration-200 active:scale-95"
      onClick={onClick}
    >
      다시 시도
    </button>
  );
}
