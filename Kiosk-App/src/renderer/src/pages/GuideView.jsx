import { ChevronLeft } from 'lucide-react';

function GuideView() {
  return (
    <button className="text-gray-800 p-4" onClick={() => (window.location.href = '#/')}>
      <ChevronLeft size={30} />
    </button>
  );
}

export default GuideView;
