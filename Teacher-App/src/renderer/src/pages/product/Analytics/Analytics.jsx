import { useState, useEffect } from 'react';
import AnalyticsMainContents from './AnalyiticsMainContents';
import SideView from './SideView';

function Analytics() {
  //현재 선택한 학생
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [contentWidth, setContentWidth] = useState(50); // 왼쪽 영역 비율 (%)
  const [isDragging, setIsDragging] = useState(false); // 드래그 중인지 여부
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(50);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
    setStartWidth(contentWidth);
    document.body.style.userSelect = 'none';
  };

  // 드래그 중
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const delta = ((e.clientX - startX) / window.innerWidth) * 100;
    const newWidth = startWidth + delta;
    if (newWidth > 35 && newWidth < 65) {
      setContentWidth(newWidth);
    }
  };

  // 드래그 종료
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex h-full">
      {/* Main Contents */}
      <div
        style={{ width: `${contentWidth}%` }}
        className={`flex flex-col overflow-auto scrollbar-hide ${selectedStudent ? '' : 'flex-1'} min-w-fit`}
      >
        <AnalyticsMainContents setSelectedStudent={setSelectedStudent} />
      </div>

      {/* Handle */}
      {selectedStudent && (
        <div
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="w-1 bg-gray-200 hover:bg-blue-500 cursor-col-resize transition-colors relative group shrink-0 ml-5"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-16 bg-gray-300 group-hover:bg-blue-600 rounded-full"></div>
        </div>
      )}

      {/* SideView */}
      {selectedStudent && (
        <SideView
          contentWidth={contentWidth}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
        />
      )}
    </div>
  );
}
export default Analytics;
