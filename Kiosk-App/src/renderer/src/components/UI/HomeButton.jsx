export default function HomeButton() {
  return (
    <button
      onClick={() => (window.location.href = '/')}
      className="absolute bottom-0 w-full max-w-md px-12 py-5 bg-gray-100 text-gray-900 text-xl font-bold rounded-3xl hover:bg-gray-200 transition-all duration-200 active:scale-95 mb-8"
    >
      홈으로
    </button>
  );
}
